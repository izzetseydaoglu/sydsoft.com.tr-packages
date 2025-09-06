// https://fonts.google.com/icons adresinden ikonu seçtikten sonra kopyalayalıp alıyoruz. Icon adı da en atta hangisiyse onu ekleyelim, isimler karışmasın

import React from 'react';
import { iconMap } from './icons';
import { MaterialIconName } from './mui';

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
    iconMui?: never;
}
export type CustomIcon = { viewBox: string; content: React.ReactNode };
interface CustomIconProps extends BaseProps {
    customIcon: CustomIcon;
    name?: never;
    iconMui?: never;
}

// materialIcon ekleme
interface MUIIconProps extends BaseProps {
    iconMui: MaterialIconName;
    name?: never;
    customIcon?: never;
}

export type Props = NameIconProps | MUIIconProps | CustomIconProps;

const defaultIconStyle: React.CSSProperties = {
    userSelect: 'none',
    width: '1em',
    height: '1em',
    display: 'inline-block',
    verticalAlign: 'middle',
    flexShrink: 0
};

export const Icon: React.FC<Props> = ({ name, iconMui, customIcon, fontSize, color, className, style, ...other }) => {
    if (iconMui) {
        return (
            <span
                className={`material-icons ${className || ''}`}
                style={{
                    ...defaultIconStyle,
                    ...style,
                    fontSize: fontSize || '1.5rem',
                    color: color || 'inherit'
                }}
                aria-hidden="true"
                {...other}>
                {iconMui}
            </span>
        );
    }

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
                fontSize: fontSize || '1.5rem',
                color: color || 'inherit'
            }}
            {...other}>
            <svg viewBox={iconComponent.viewBox} fill={'currentColor'} xmlns="http://www.w3.org/2000/svg">
                {iconComponent.content}
            </svg>
        </span>
    );
};
