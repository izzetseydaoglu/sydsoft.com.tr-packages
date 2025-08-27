import React from "react";
import styles from "./index.module.css";

// Row Component
export type typeSpacingValues = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type typeJustifyContent = "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";
export type typeAlignItems = "stretch" | "flex-start" | "flex-end" | "center" | "baseline";
export type typeAlignContent = "stretch" | "flex-start" | "flex-end" | "center" | "space-between" | "space-around" | "space-evenly";

export interface RowProps {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
    flexWrap?: "wrap" | "wrap-reverse" | "nowrap";
    justifyContent?: typeJustifyContent;
    alignContent?: typeAlignContent;
    alignItems?: typeAlignItems;
    rowSpacing?: typeSpacingValues;
    colSpacing?: typeSpacingValues;
}

export const Row: React.FC<RowProps> = ({
    children,
    className = "",
    style,
    flexDirection = "row",
    flexWrap = "wrap",
    justifyContent = "flex-start",
    alignContent = "center",
    alignItems = "center",
    rowSpacing = 2,
    colSpacing = 2
}) => {
    const classes = [
        styles.row,
        rowSpacing !== undefined && styles[`row-spacing-${rowSpacing}`],
        colSpacing !== undefined && styles[`col-spacing-${colSpacing}`],
        flexDirection !== "row" && styles[`flex-${flexDirection.replace("-", "-")}`],
        flexWrap !== "wrap" && styles[`flex-${flexWrap}`],
        justifyContent !== "flex-start" && styles[`justify-${justifyContent.replace("flex-", "").replace("space-", "")}`],
        alignItems !== "center" && styles[`align-items-${alignItems.replace("flex-", "")}`],
        alignContent !== "center" && styles[`align-content-${alignContent.replace("flex-", "")}`],
        className
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};

// Col Component
export type GridValues = "auto" | "full" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

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

export const Col: React.FC<ColProps> = ({ children, className = "", style, xs, sm, md, lg, xl, xxl }) => {
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
        .join(" ");

    return (
        <div className={classes} style={style}>
            {children}
        </div>
    );
};

// Hidden Component
export interface HiddenProps {
    children: React.ReactElement;
    hidden?: "xs" | "sm" | "md" | "lg" | "xl" | "xxl";
    onlyHidden?: ("xs" | "sm" | "md" | "lg" | "xl" | "xxl")[];
}

export const Hidden: React.FC<HiddenProps> = ({ children, hidden, onlyHidden }) => {
    const existingClassName = children.props.className || "";
    const hiddenClasses: string[] = [];

    if (onlyHidden) {
        onlyHidden.forEach((breakpoint) => {
            hiddenClasses.push(styles[`hidden-${breakpoint}`]);
        });
    } else if (hidden) {
        // Orijinal mantık: seçilen breakpoint ve altındaki tüm breakpoint'ler gizlenir
        const breakpoints = ["xs", "sm", "md", "lg", "xl", "xxl"];
        const targetIndex = breakpoints.indexOf(hidden);

        if (targetIndex !== -1) {
            for (let i = 0; i <= targetIndex; i++) {
                hiddenClasses.push(styles[`hidden-${breakpoints[i]}`]);
            }
        }
    }

    const newClassName = [existingClassName, ...hiddenClasses].filter(Boolean).join(" ");

    return React.cloneElement(children, {
        className: newClassName
    });
};
