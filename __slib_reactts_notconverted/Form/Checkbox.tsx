/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {useRef} from 'react'
import styled from 'styled-components'

interface Props {
    checked: boolean,
    ref?: any,
    name?: string,
    label?: string,
    className?: string
    disabled?: boolean
    onToogle?: (e: any) => void
    style?: React.CSSProperties,
    styleCheckbox?: React.CSSProperties,
    styleLabel?: React.CSSProperties,
    tabIndex?: number
    required?: boolean,
    children?: any,
}

export const Checkbox: React.FC<Props> = ({
    ref, children, name, label, checked, className,
    style, styleCheckbox, styleLabel,
    onToogle, disabled, tabIndex,
    required = false
}) => {
    const refMain = useRef<any>();

    const onChange = () => {
        if (onToogle) onToogle({
            target: {
                name,
                value: refMain.current.querySelector("input").checked
            }
        });
    };

    const toogleCheck = () => {
        refMain.current.querySelector("input").checked = !refMain.current.querySelector("input").checked;
        onChange();
    };
    return (<MainBase ref={refMain} className={className} style={style} tabIndex={tabIndex}>
            <input
                ref={ref}
                type="checkbox"
                name={name}
                onChange={onChange}
                checked={checked}
                required={required}
                style={styleCheckbox}
            />
            {label && <label onClick={toogleCheck} style={styleLabel}>{label}</label>}
            {children && <div>{children}</div>}
        </MainBase>
    )
}

const MainBase = styled.div`
  position: relative;
  display: inline-flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  font-size: 1rem;
  line-height: 1.4375em;
  user-select: none;
  
  input,label {
    cursor: pointer !important;
  }

`
