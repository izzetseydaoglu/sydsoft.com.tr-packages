/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-01-17 18:20:08
 */

import React, { cloneElement, memo, useEffect, useRef } from 'react';

import { createRoot } from 'react-dom/client';

type position = 'top' | 'bottom' | 'left' | 'right';

interface Props {
    component: any;
    children: React.ReactNode;
    position?: position;
    removeWhenClickInside?: boolean;
    arrow?: boolean;
    distance?: number;
}

export const Popover = memo(function MemoFunction({ children, component, position = 'top', arrow = false, distance = 5, removeWhenClickInside = false, ...other }: Props) {
    const refComponent = useRef<any>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const cssCheck = document.getElementsByClassName('spopover_css')[0];
        if (!cssCheck) {
            const head = document.getElementsByTagName('head')[0];
            const s = document.createElement('style');
            s.setAttribute('type', 'text/css');
            s.classList.add('spopover_css');
            s.appendChild(document.createTextNode(popoverCss));
            head.appendChild(s);
        }
        return () => {
            popoverSil();
        };
    }, []);

    const checkHideBackDrop = (e: any) => {
        const spopover = document.querySelector('.spopover');
        if (spopover && !spopover.contains(e.target)) popoverSil();
    };

    const popoverEkle = (e: any) => {
        popoverSil();
        const popover = document.createElement('div');
        popover.classList.add('spopover');
        document.body.appendChild(popover);
        // ReactDOM.render(children, popover)
        const root = createRoot(popover!); // createRoot(container!) if you use TypeScript
        root.render(children);
        const target = e.currentTarget;
        refComponent.current && refComponent.current.classList.add('spopover_active');
        setTimeout(() => {
            popoverPosition({ target, position: position });
        }, 100);
        window.addEventListener('mousedown', checkHideBackDrop);
        if (removeWhenClickInside) popover.addEventListener('mouseup', popoverGecikmeliSil);
        document.body.classList.add('spopover_open');
    };

    const popoverSil = () => {
        refComponent.current && refComponent.current.classList.remove('spopover_active');
        const check = document.body.getElementsByClassName('spopover')[0];
        if (check) {
            if (removeWhenClickInside) check.removeEventListener('mouseup', popoverGecikmeliSil);
            check.remove();
        }
        window.removeEventListener('mousedown', checkHideBackDrop);
        document.body.classList.remove('spopover_open');
    };

    const popoverGecikmeliSil = () => setTimeout(() => popoverSil(), 100);

    const popoverPosition = ({ target, position }: { target: HTMLElement; position: position }) => {
        const popover = document.body.getElementsByClassName('spopover')[0];
        if (popover) {
            const arrowMargin = arrow ? 5 : 0;
            const margin = distance + arrowMargin;

            if (arrow) popover.classList.add('arrow');

            const targetPosition = target.getBoundingClientRect();
            const popoverPosition = popover.getBoundingClientRect();

            const style = [];

            if (position === 'top' || position === 'bottom') {
                if (position === 'top') {
                    if (targetPosition.top - popoverPosition.height - margin < 0) {
                        style.push('top:' + (targetPosition.bottom + margin) + 'px');
                        popover.classList.add('bottom');
                    } else {
                        style.push('top:' + (targetPosition.top - popoverPosition.height - margin) + 'px');
                        popover.classList.add('top');
                    }
                }
                if (position === 'bottom') {
                    if (targetPosition.bottom + popoverPosition.height + margin > window.innerHeight) {
                        style.push('top:' + (targetPosition.top - popoverPosition.height - margin) + 'px');
                        popover.classList.add('top');
                    } else {
                        style.push('top:' + (targetPosition.bottom + margin) + 'px');
                        popover.classList.add('bottom');
                    }
                }

                if (targetPosition.left + targetPosition.width / 2 - popoverPosition.width / 2 < 0) {
                    style.push('left:2px');
                    popover.classList.add('start');
                } else if (targetPosition.left + targetPosition.width / 2 + popoverPosition.width > window.innerWidth) {
                    style.push('right:2px');
                    popover.classList.add('end');
                } else {
                    style.push('left:' + (targetPosition.left + targetPosition.width / 2) + 'px');
                    style.push('transform:translate(-50%,0)');
                    popover.classList.add('center');
                }
            }

            if (position === 'left' || position === 'right') {
                if (position === 'left') {
                    if (targetPosition.left - popoverPosition.width - margin < 0) {
                        style.push('left:' + (targetPosition.right + margin) + 'px');
                        popover.classList.add('right');
                    } else {
                        style.push('left:' + (targetPosition.left - popoverPosition.width - margin) + 'px');
                        popover.classList.add('left');
                    }
                }
                if (position === 'right') {
                    if (targetPosition.left + targetPosition.width / 2 + popoverPosition.width + margin > window.innerWidth) {
                        style.push('left:' + (targetPosition.left - popoverPosition.width - margin) + 'px');
                        popover.classList.add('left');
                    } else {
                        style.push('left:' + (targetPosition.right + margin) + 'px');
                        popover.classList.add('right');
                    }
                }

                if (targetPosition.top + targetPosition.height / 2 - popoverPosition.height / 2 < 0) {
                    style.push('top:2px');
                    popover.classList.add('start');
                } else if (targetPosition.top + targetPosition.height / 2 + popoverPosition.height / 2 > window.innerHeight) {
                    style.push('bottom:2px');
                    popover.classList.add('end');
                } else {
                    style.push('top:' + (targetPosition.top + targetPosition.height / 2) + 'px');
                    style.push('transform:translate(0,-50%)');
                    popover.classList.add('center');
                }
            }

            popover.setAttribute('style', style.join(';'));
        }
    };

    return cloneElement(component, {
        ref: refComponent,
        onClick: popoverEkle,
        ...other
    });
});

const popoverCss = `
.spopover {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.spopover.arrow:after {
    content: "";
    position: absolute;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
}

.spopover.arrow.top:after {
    top: 100%;
    border-color: #757575 transparent transparent transparent;
}

.spopover.arrow.top.start:after { left: 15px;}

.spopover.arrow.top.center:after { left: 50%;}

.spopover.arrow.top.end:after { right: 15px;}


.spopover.arrow.bottom:after {
    bottom: 100%;
    border-color: transparent transparent #757575 transparent;
}

.spopover.arrow.bottom.start:after { left: 15px;}

.spopover.arrow.bottom.center:after { left: 50%;}

.spopover.bottom.end:after { right: 15px;}

.spopover.arrow.left:after {
    margin-left: -1px;
    left: 100%;
    border-color: transparent transparent transparent #757575;
}

.spopover.arrow.left.start:after { top: 5px;}

.spopover.arrow.left.center:after { top: 50%; margin-top: -5px;}

.spopover.arrow.left.end:after { bottom: 15px;}

.spopover.arrow.right:after {
    margin-right: -1px;
    right: 100%;
    border-color: transparent #757575 transparent transparent;
}

.spopover.arrow.right.start:after { top: 5px;}

.spopover.arrow.right.center:after { top: 50%; margin-top: -5px;}

.spopover.arrow.right.end:after { bottom: 15px;}
`;
