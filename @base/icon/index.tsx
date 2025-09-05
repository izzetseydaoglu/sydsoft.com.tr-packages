// https://fonts.google.com/icons adresinden ikonu seçtikten sonra kopyalayalıp alıyoruz. Icon adı da en atta hangisiyse onu ekleyelim, isimler karışmasın

import React from "react";
import { iconMap } from "./icons";

export const iconList = Object.keys(iconMap) as IconName[];
export type IconName = keyof typeof iconMap;

interface BaseProps {
    color?: string;
    fontSize?: number | string;
    style?: React.CSSProperties;
    className?: string;
    [key: string]: any;
}

// name ile customIcon mutually exclusive
interface NameIconProps extends BaseProps {
    name: IconName;
    customIcon?: never;
}
export type CustomIcon = { viewBox: string; content: string };
interface CustomIconProps extends BaseProps {
    customIcon: CustomIcon;
    name?: never;
}

export type Props = NameIconProps | CustomIconProps;

const defaultIconStyle: React.CSSProperties = {
    userSelect: "none",
    width: "1em",
    height: "1em",
    display: "inline-block",
    verticalAlign: "middle",
    flexShrink: 0
};

export const Icon: React.FC<Props> = ({ name, customIcon, fontSize, color, className, style, ...other }) => {
    const iconComponent = name ? iconMap[name] : customIcon;
   
    if (!iconComponent) {
        return <span>⚠️</span>;
    }

    return (
        <span
            className={className}
            style={{
                ...defaultIconStyle,
                ...style,
                fontSize: fontSize || "1.5rem",
                color: color || "inherit"
            }}
            {...other}>
            <svg viewBox={iconComponent.viewBox} fill={"currentColor"} xmlns="http://www.w3.org/2000/svg">
                <g dangerouslySetInnerHTML={{ __html: iconComponent.content }} />
            </svg>
        </span>
    );
};
