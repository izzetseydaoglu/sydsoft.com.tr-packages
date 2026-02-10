/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 16:12:35
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

export interface PopoverConfigBaseProps {
    position?: PopoverPosition;
    removeWhenClickInside?: boolean;
    hideBackdrop?: boolean;
    arrow?: boolean;
    distance?: number;
    fade?: boolean;
    arrowColor?: ArrowColor;
    hover?: boolean;
    hoverCloseDelay?: number;
    keepMounted?: boolean;
}

interface PopoverProps extends PopoverConfigBaseProps {
    component: any;
    children: React.ReactNode;
}

export const Popover = memo(function MemoFunction({
    children,
    component,
    position = 'top',
    arrow = false,
    distance = 5,
    removeWhenClickInside = false,
    hideBackdrop = true,
    fade = true,
    arrowColor = 'auto',
    hover = false,
    hoverCloseDelay = 120,
    keepMounted = false,
    ...other
}: PopoverProps) {
    const refComponent = useRef<any>(null);
    const closeTimer = useRef<number | null>(null);
    const hoverCloseTimer = useRef<number | null>(null);
    const popoverRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<any>(null);
    const zIndexRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        return () => {
            popoverSil(false);
        };
    }, []);

    const checkHideBackDrop = (e: any) => {
        const spopover = popoverRef.current;
        if (!spopover) return;

        if (!(e?.target instanceof Node)) {
            popoverSil();
            return;
        }

        if (!spopover.contains(e.target)) popoverSil();
    };

    const popoverEkle = (e: any) => {
        if (popoverRef.current && keepMounted) {
            const popover = popoverRef.current;
            const target = e.currentTarget;
            const wasVisible = popover.classList.contains(styles.visible);
            rootRef.current?.render?.(children);
            applyArrowColor(popover);
            popoverPosition({ target, position: position });
            popover.style.zIndex = String(nextPopoverZIndex());
            popover.classList.remove(styles.closing);
            popover.classList.add(styles.visible);
            if (!wasVisible) {
                if (hideBackdrop) {
                    window.addEventListener('mousedown', checkHideBackDrop);
                    window.addEventListener('blur', checkHideBackDrop);
                }
                if (removeWhenClickInside) popover.addEventListener('mouseup', popoverGecikmeliSil);
                if (hover) {
                    popover.addEventListener('mouseenter', clearHoverClose);
                    popover.addEventListener('mouseleave', scheduleHoverClose);
                }
                incrementBodyPopover();
            }
            return;
        }
        popoverSil(false);
        const popover = document.createElement('div');
        popover.classList.add('spopover', styles.popover);
        const zIndex = nextPopoverZIndex();
        zIndexRef.current = zIndex;
        document.body.appendChild(popover);
        // ReactDOM.render(children, popover)
        const root = createRoot(popover!);
        root.render(children);
        popoverRef.current = popover;
        rootRef.current = root;
        const target = e.currentTarget;
        refComponent.current && refComponent.current.classList.add('spopover_active');
        setTimeout(() => {
            applyArrowColor(popover);
            popoverPosition({ target, position: position });
            popover.style.zIndex = String(zIndexRef.current ?? zIndex);
            popover.classList.add(styles.visible);
        }, 100);
        if (hideBackdrop) {
            window.addEventListener('mousedown', checkHideBackDrop);
            window.addEventListener('blur', checkHideBackDrop);
        }
        if (removeWhenClickInside) popover.addEventListener('mouseup', popoverGecikmeliSil);
        if (hover) {
            popover.addEventListener('mouseenter', clearHoverClose);
            popover.addEventListener('mouseleave', scheduleHoverClose);
        }
        incrementBodyPopover();
    };

    const popoverSil = (animate = true) => {
        refComponent.current && refComponent.current.classList.remove('spopover_active');
        const check = popoverRef.current;
        const wasVisible = !!check?.classList.contains(styles.visible);
        if (check) {
            if (removeWhenClickInside) check.removeEventListener('mouseup', popoverGecikmeliSil);
            if (hover) {
                check.removeEventListener('mouseenter', clearHoverClose);
                check.removeEventListener('mouseleave', scheduleHoverClose);
            }
            if (closeTimer.current) window.clearTimeout(closeTimer.current);
            if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
            if (!fade || !animate) {
                if (!keepMounted) {
                    const root = rootRef.current;
                    window.setTimeout(() => {
                        root?.unmount?.();
                    }, 0);
                    check.remove();
                    popoverRef.current = null;
                    rootRef.current = null;
                } else {
                    check.classList.remove(styles.visible);
                    check.classList.remove(styles.closing);
                }
            } else if (!check.classList.contains(styles.closing)) {
                check.classList.add(styles.closing);
                closeTimer.current = window.setTimeout(() => {
                    if (!keepMounted) {
                        const root = rootRef.current;
                        root?.unmount?.();
                        check.remove();
                        popoverRef.current = null;
                        rootRef.current = null;
                    } else {
                        check.classList.remove(styles.visible);
                        check.classList.remove(styles.closing);
                    }
                }, FADE_DURATION);
            }
        }
        if (hideBackdrop) {
            window.removeEventListener('mousedown', checkHideBackDrop);
            window.removeEventListener('blur', checkHideBackDrop);
        }
        if (wasVisible) decrementBodyPopover();
    };

    const popoverGecikmeliSil = () => setTimeout(() => popoverSil(), 100);
    const clearHoverClose = () => {
        if (hoverCloseTimer.current) window.clearTimeout(hoverCloseTimer.current);
        hoverCloseTimer.current = null;
    };
    const scheduleHoverClose = () => {
        clearHoverClose();
        hoverCloseTimer.current = window.setTimeout(() => popoverSil(), hoverCloseDelay);
    };

    const popoverPosition = ({ target, position }: { target: HTMLElement; position: PopoverPosition }) => {
        const popover: any = popoverRef.current;
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

    function incrementBodyPopover() {
        const body = document.body;
        const count = Number(body.dataset.spopoverCount || '0') + 1;
        body.dataset.spopoverCount = String(count);
        if (count > 0) body.classList.add('spopover_open');
    }

    function decrementBodyPopover() {
        const body = document.body;
        const count = Math.max(0, Number(body.dataset.spopoverCount || '0') - 1);
        if (count === 0) {
            delete body.dataset.spopoverCount;
            body.classList.remove('spopover_open');
        } else {
            body.dataset.spopoverCount = String(count);
        }
    }

    function nextPopoverZIndex() {
        const body = document.body;
        const current = Number(body.dataset.spopoverZIndex || '10000');
        const next = current + 1;
        body.dataset.spopoverZIndex = String(next);
        return next;
    }

    const componentProps: Record<string, any> = {
        ref: refComponent,
        onClick: (e: any) => {
            component.props?.onClick?.(e);
            popoverEkle(e);
        },
        ...other
    };

    if (hover) {
        componentProps.onMouseEnter = (e: any) => {
            component.props?.onMouseEnter?.(e);
            clearHoverClose();
            popoverEkle(e);
        };
        componentProps.onMouseLeave = (e: any) => {
            component.props?.onMouseLeave?.(e);
            scheduleHoverClose();
        };
    }

    return cloneElement(component, componentProps);
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
