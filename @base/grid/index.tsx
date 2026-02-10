/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { useState } from 'react';

import styles from './index.module.css';

// Row Component
export type typeSpacingValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type typeJustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type typeAlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
export type typeAlignContent = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';

export interface RowProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    flexWrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
    justifyContent?: typeJustifyContent;
    alignContent?: typeAlignContent;
    alignItems?: typeAlignItems;
    rowSpacing?: typeSpacingValues;
    colSpacing?: typeSpacingValues;
}

export const Row: React.FC<RowProps> = ({
    children,
    className = '',
    style,
    flexDirection = 'row',
    flexWrap = 'wrap',
    justifyContent = 'flex-start',
    alignContent = 'center',
    alignItems = 'center',
    rowSpacing = 2,
    colSpacing = 2,
    ...other
}) => {
    const classes = [
        styles.row,
        rowSpacing !== undefined && styles[`row-spacing-${rowSpacing}`],
        colSpacing !== undefined && styles[`col-spacing-${colSpacing}`],
        flexDirection !== 'row' && styles[`flex-${flexDirection.replace('-', '-')}`],
        flexWrap !== 'wrap' && styles[`flex-${flexWrap}`],
        justifyContent !== 'flex-start' && styles[`justify-${justifyContent.replace('flex-', '').replace('space-', '')}`],
        alignItems !== 'center' && styles[`align-items-${alignItems.replace('flex-', '')}`],
        alignContent !== 'center' && styles[`align-content-${alignContent.replace('flex-', '')}`],
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} style={style} {...other}>
            {children}
        </div>
    );
};

// Col Component
export type GridValues = 'auto' | 'full' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface ColProps {
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    xs?: GridValues;
    sm?: GridValues;
    md?: GridValues;
    lg?: GridValues;
    xl?: GridValues;
    xxl?: GridValues;
}

export const Col: React.FC<ColProps> = ({ children, className = '', style, xs, sm, md, lg, xl, xxl, ...other }) => {
    // Cascading logic - aynı sizin component'inizdeki gibi

    const classes = [
        styles.col,
        // Sadece belirtilen breakpoint'ler için class ekle
        xs && styles[`col-xs-${xs}`],
        sm && styles[`col-sm-${sm}`],
        md && styles[`col-md-${md}`],
        lg && styles[`col-lg-${lg}`],
        xl && styles[`col-xl-${xl}`],
        xxl && styles[`col-xxl-${xxl}`],
        className
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={classes} style={style} {...other}>
            {children}
        </div>
    );
};

// Hidden Component
export interface HiddenProps {
    children: React.ReactElement;
    hidden?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    onlyHidden?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[];
}

export const Hidden: React.FC<HiddenProps> = ({ children, hidden, onlyHidden, ...other }) => {
    const existingClassName = children.props.className || '';
    const hiddenClasses: string[] = [];

    if (onlyHidden) {
        onlyHidden.forEach((breakpoint) => {
            hiddenClasses.push(styles[`hidden-${breakpoint}`]);
        });
    } else if (hidden) {
        // Orijinal mantık: seçilen breakpoint ve altındaki tüm breakpoint'ler gizlenir
        const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'];
        const targetIndex = breakpoints.indexOf(hidden);

        if (targetIndex !== -1) {
            for (let i = 0; i <= targetIndex; i++) {
                hiddenClasses.push(styles[`hidden-${breakpoints[i]}`]);
            }
        }
    }

    const newClassName = [existingClassName, ...hiddenClasses].filter(Boolean).join(' ');

    return React.cloneElement(children, {
        className: newClassName,
        ...other
    });
};


export const DevelopGridComponent: React.FC = () => {
    const [currentBreakpoint, setCurrentBreakpoint] = useState('');

    // Breakpoint detector
    React.useEffect(() => {
        const updateBreakpoint = () => {
            const width = window.innerWidth;
            let breakpoint = '';
            if (width <= 576) breakpoint = 'XS (≤576px)';
            else if (width <= 768) breakpoint = 'SM (577-768px)';
            else if (width <= 992) breakpoint = 'MD (769-992px)';
            else if (width <= 1200) breakpoint = 'LG (993-1200px)';
            else if (width <= 1400) breakpoint = 'XL (1201-1400px)';
            else breakpoint = 'XXL (≥1401px)';
            setCurrentBreakpoint(breakpoint);
        };

        updateBreakpoint();
        window.addEventListener('resize', updateBreakpoint);
        return () => window.removeEventListener('resize', updateBreakpoint);
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                bottom: '10px',
                right: '10px',
                background: '#333',
                color: 'white',
                padding: '10px',
                borderRadius: '4px',
                zIndex: 9999999
            }}
        >
            Current: {currentBreakpoint}
        </div>
    );
};