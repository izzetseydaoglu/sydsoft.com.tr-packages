import React, { useRef } from "react";

import styles from "./styles/Input.module.css";

interface Props {
    checked: "0" | "1" | boolean;
    ref?: React.Ref<any>;
    name?: string;
    label?: string;
    className?: string;
    disabled?: boolean;
    onToogle?: (e: { target: { name?: string; value: "0" | "1" } }) => void;
    style?: React.CSSProperties;
    styleCheckbox?: React.CSSProperties;
    styleLabel?: React.CSSProperties;
    tabIndex?: number;
    required?: boolean;
    children?: React.ReactNode;
}

export const Checkbox: React.FC<Props> = ({ ref, children, name, label, checked, className, style, styleCheckbox, styleLabel, onToogle, disabled, tabIndex, required = false }) => {
    const refMain = useRef<HTMLDivElement>(null);

    // checked değerini boolean hâline getiriyoruz
    const isChecked = checked === "1" || checked === true;

    const handleChange = (newChecked: boolean) => {
        if (disabled) return;
        onToogle?.({
            target: {
                name,
                value: newChecked ? "1" : "0"
            }
        });
    };

    const toggleCheck = () => {
        handleChange(!isChecked);
    };

    return (
        <div ref={refMain} className={`${styles.checkbox} ${className || ""}`} style={style} tabIndex={tabIndex} onClick={toggleCheck}>
            <input ref={ref} type="checkbox" name={name} onChange={(e) => handleChange(e.target.checked)} checked={isChecked} required={required} style={styleCheckbox} disabled={disabled} />
            {label && <label style={styleLabel}>{label}</label>}
            {children && <div>{children}</div>}
        </div>
    );
};
