/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-01-31 00:00:00
 */

import React, { cloneElement, memo, useEffect, useRef } from 'react';

import { createRoot } from 'react-dom/client';
import styles from './index.module.css';

type PopoverSide = 'top' | 'bottom' | 'left' | 'right';
type PopoverPosition =
    | 'top'
    | 'top-left'
    | 'top-right'
    | 'bottom'
    | 'bottom-left'
    | 'bottom-right'
    | 'left'
    | 'left-top'
    | 'left-center'
    | 'left-bottom'
    | 'right'
    | 'right-top'
    | 'right-center'
    | 'right-bottom';
type HorizontalAlign = 'left' | 'center' | 'right';
type VerticalAlign = 'top' | 'center' | 'bottom';
type AlignClass = 'start' | 'center' | 'end';
type ArrowColor = 'auto' | string;

interface Props {
    component: any;
    children: React.ReactNode;
    position?: PopoverPosition;
    removeWhenClickInside?: boolean;
    arrow?: boolean;
    distance?: number;
    fade?: boolean;
    arrowColor?: ArrowColor;
}

export const Popover = memo(function MemoFunction({
    children,
    component,
    position = 'top',
    arrow = false,
    distance = 5,
    removeWhenClickInside = false,
    fade = true,
    arrowColor = 'auto',
    ...other
}: Props) {
    const refComponent = useRef<any>(null);
    const closeTimer = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        return () => {
            popoverSil(false);
        };
    }, []);

    const checkHideBackDrop = (e: any) => {
        const spopover = document.querySelector('.spopover');
        if (!spopover) return;

        if (!(e?.target instanceof Node)) {
            popoverSil();
            return;
        }

        if (!spopover.contains(e.target)) popoverSil();
    };

    const popoverEkle = (e: any) => {
        popoverSil(false);
        const popover = document.createElement('div');
        popover.classList.add('spopover', styles.popover);
        document.body.appendChild(popover);
        // ReactDOM.render(children, popover)
        const root = createRoot(popover!);
        root.render(children);
        const target = e.currentTarget;
        refComponent.current && refComponent.current.classList.add('spopover_active');
        setTimeout(() => {
            applyArrowColor(popover);
            popoverPosition({ target, position: position });
            popover.classList.add(styles.visible);
        }, 100);
        window.addEventListener('mousedown', checkHideBackDrop);
        window.addEventListener('blur', checkHideBackDrop);
        if (removeWhenClickInside) popover.addEventListener('mouseup', popoverGecikmeliSil);
        document.body.classList.add('spopover_open');
    };

    const popoverSil = (animate = true) => {
        refComponent.current && refComponent.current.classList.remove('spopover_active');
        const check = document.body.getElementsByClassName('spopover')[0];
        if (check) {
            if (removeWhenClickInside) check.removeEventListener('mouseup', popoverGecikmeliSil);
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
            if (!fade || !animate) {
                check.remove();
            } else if (!check.classList.contains(styles.closing)) {
                check.classList.add(styles.closing);
                closeTimer.current = window.setTimeout(() => {
                    check.remove();
                }, FADE_DURATION);
            }
        }
        window.removeEventListener('mousedown', checkHideBackDrop);
        window.removeEventListener('blur', checkHideBackDrop);
        document.body.classList.remove('spopover_open');
    };

    const popoverGecikmeliSil = () => setTimeout(() => popoverSil(), 100);

    const popoverPosition = ({ target, position }: { target: HTMLElement; position: PopoverPosition }) => {
        const popover: any = document.body.getElementsByClassName('spopover')[0];
        if (popover) {
            const arrowMargin = arrow ? 5 : 0;
            const margin = distance + arrowMargin;
            const { side: preferredSide, align: preferredAlign } = normalizePosition(position);
            const targetPosition = target.getBoundingClientRect();
            const popoverPosition = popover.getBoundingClientRect();

            const style = [];

            let side = preferredSide;
            if (side === 'top' && targetPosition.top - popoverPosition.height - margin < 0) side = 'bottom';
            if (side === 'bottom' && targetPosition.bottom + popoverPosition.height + margin > window.innerHeight) side = 'top';
            if (side === 'left' && targetPosition.left - popoverPosition.width - margin < 0) side = 'right';
            if (side === 'right' && targetPosition.right + popoverPosition.width + margin > window.innerWidth) side = 'left';

            if (side === 'top') style.push('top:' + (targetPosition.top - popoverPosition.height - margin) + 'px');
            if (side === 'bottom') style.push('top:' + (targetPosition.bottom + margin) + 'px');
            if (side === 'left') style.push('left:' + (targetPosition.left - popoverPosition.width - margin) + 'px');
            if (side === 'right') style.push('left:' + (targetPosition.right + margin) + 'px');

            let alignClass: AlignClass = 'center';
            if (side === 'top' || side === 'bottom') {
                const { left, alignClass: resolvedAlign } = resolveHorizontalAlign(preferredAlign as HorizontalAlign, targetPosition, popoverPosition);
                alignClass = resolvedAlign;
                style.push('left:' + left + 'px');
            } else {
                const { top, alignClass: resolvedAlign } = resolveVerticalAlign(preferredAlign as VerticalAlign, targetPosition, popoverPosition);
                alignClass = resolvedAlign;
                style.push('top:' + top + 'px');
            }

            const classNames = ['spopover', styles.popover, arrow ? styles.arrow : '', fade ? '' : styles.noFade, sideClass[side], alignClassMap[alignClass]].filter(Boolean);

            popover.className = classNames.join(' ');
            popover.setAttribute('style', style.join(';'));
            applyArrowColor(popover);
        }
    };

    function applyArrowColor(popoverEl: HTMLElement) {
        if (!arrowColor) {
            popoverEl.style.removeProperty('--popover-arrow-color');
            return;
        }
        if (arrowColor === 'auto') {
            const targetEl = (popoverEl.firstElementChild as HTMLElement | null) ?? popoverEl;
            let bg = window.getComputedStyle(targetEl).backgroundColor;
            if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
                const parent = targetEl.parentElement;
                if (parent) bg = window.getComputedStyle(parent).backgroundColor;
            }
            if (bg) popoverEl.style.setProperty('--popover-arrow-color', bg);
            return;
        }
        popoverEl.style.setProperty('--popover-arrow-color', arrowColor);
    }

    return cloneElement(component, {
        ref: refComponent,
        onClick: popoverEkle,
        ...other
    });
});

const sideClass: Record<PopoverSide, string> = {
    top: styles.top,
    bottom: styles.bottom,
    left: styles.left,
    right: styles.right
};

const alignClassMap: Record<AlignClass, string> = {
    start: styles.alignStart,
    center: styles.alignCenter,
    end: styles.alignEnd
};

const FADE_DURATION = 160;

const normalizePosition = (position: PopoverPosition): { side: PopoverSide; align: HorizontalAlign | VerticalAlign } => {
    const [side, rawAlign] = position.split('-') as [PopoverSide, string | undefined];
    if (side === 'top' || side === 'bottom') {
        const align: HorizontalAlign = rawAlign === 'left' || rawAlign === 'right' ? rawAlign : 'center';
        return { side, align };
    }
    const align: VerticalAlign = rawAlign === 'top' || rawAlign === 'bottom' ? rawAlign : 'center';
    return { side, align };
};

const resolveHorizontalAlign = (align: HorizontalAlign, target: DOMRect, popover: DOMRect): { left: number; alignClass: AlignClass } => {
    const clamp = 2;
    let left = 0;
    let alignClass: AlignClass = 'center';

    if (align === 'left') {
        left = target.left;
        alignClass = 'start';
    } else if (align === 'right') {
        left = target.right - popover.width;
        alignClass = 'end';
    } else {
        left = target.left + target.width / 2 - popover.width / 2;
        alignClass = 'center';
    }

    if (left < clamp) {
        left = clamp;
        alignClass = 'start';
    } else if (left + popover.width > window.innerWidth - clamp) {
        left = window.innerWidth - popover.width - clamp;
        alignClass = 'end';
    }

    return { left, alignClass };
};

const resolveVerticalAlign = (align: VerticalAlign, target: DOMRect, popover: DOMRect): { top: number; alignClass: AlignClass } => {
    const clamp = 2;
    let top = 0;
    let alignClass: AlignClass = 'center';

    if (align === 'top') {
        top = target.top;
        alignClass = 'start';
    } else if (align === 'bottom') {
        top = target.bottom - popover.height;
        alignClass = 'end';
    } else {
        top = target.top + target.height / 2 - popover.height / 2;
        alignClass = 'center';
    }

    if (top < clamp) {
        top = clamp;
        alignClass = 'start';
    } else if (top + popover.height > window.innerHeight - clamp) {
        top = window.innerHeight - popover.height - clamp;
        alignClass = 'end';
    }

    return { top, alignClass };
};
