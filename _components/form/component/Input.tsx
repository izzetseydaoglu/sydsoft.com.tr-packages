/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */

import React, {useCallback, useEffect, useRef, useState} from 'react'
import styled from 'styled-components'
import $ from 'jquery';
import {alert_add} from "@sydsoft.com.tr/alert";
import {Dialog} from "./Dialog";

const Inputmask = (typeof (window) != "undefined") ? require("./assets/plugins/jquery.mask.min") : {};


type maskSettingsTranslation = {
    [key: string]: {
        pattern: any,
        fallback?: any,
        optional?: boolean,
    }
}

type maskSettings = {
    clearIfNotMatch?: boolean,
    reverse?: boolean,
    translation?: maskSettingsTranslation,
}

export interface PropsInput {
    componentRef?: any
    inputRef?: any
    className?: string
    id?: string
    name?: string
    value?: any,
    defaultValue?: any,
    label?: string
    loading?: boolean
    autoFocus?: boolean | undefined
    disabled?: boolean
    required?: boolean
    placeholder?: string
    type?:
        | 'text'
        | 'number'
        | 'email'
        | 'color'
        | 'date'
        | 'time'
        | 'datetime-local'
        | 'hidden'
        | 'file'
        | 'password'
        | 'tel'
        | 'search'

    // - Select
    select?: any[]
    ilkSec?: boolean,
    valueKey?: string,
    labelKey?: string,

    // - Textarea
    multiline?: boolean
    rows?: number | undefined

    //--Fonk Props
    onChange?: Function
    onFocus?: Function
    onBlur?: Function
    onClick?: Function
    onKeyPress?: Function
    onKeyUp?: Function
    onKeyDown?: Function

    //--Ozel Props
    propsComponent?: object
    propsInput?: object
    startAdornment?: any
    endAdornment?: any

    //--Ozel Fonksiyonlar
    sadeceSayi?: boolean
    tumuBuyuk?: boolean
    tumuKucuk?: boolean
    seoCevir?: boolean
    dosyaNoGiris?: boolean
    dateGecmisKontrol?: boolean

    //--Mask
    mask?: string
    maskSettings?: maskSettings
}


function tumuBuyukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        e.target.value = e.target.value.toString().toLocaleUpperCase('tr')
        e.target.setSelectionRange(start, end);
    }
}

function tumuKucukCevir(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        e.target.value = e.target.value.toString().toLocaleLowerCase('tr')
        e.target.setSelectionRange(start, end)
    }
}

function seoCevirFunction(e: React.ChangeEvent<HTMLInputElement>) {
    if (e?.target && e?.target?.setSelectionRange) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        let string = e.target.value.toString().toLocaleLowerCase('tr');
        let turkce = [" ", "-", "ş", "Ş", "ı", "ü", "Ü", "ö", "Ö", "ç", "Ç", "ş", "Ş", "ı", "ğ", "Ğ", "İ", "ö", "Ö", "Ç", "ç", "ü", "Ü", "â", "ê", "Â", "“", "”"];
        let duzgun = ["-", "-", "s", "S", "i", "u", "U", "o", "O", "c", "C", "s", "S", "i", "g", "G", "I", "o", "O", "C", "c", "u", "U", "a", "ê", "a", "", ""];
        for (let i = 0; i < turkce.length; i++) {
            string = string.split(turkce[i]).join(duzgun[i]);
        }
        string = string.replace(/[^a-z0-9\-_şıüğçİŞĞÜÇ]+/ig, '_');
        string = string.replace(/_+/g, '_');
        string = string.replace(/^-/, '_');
        string = string.replace(/-$/, '_');

        e.target.value = string;
        e.target.setSelectionRange(start, end)
    }
}

export const Input: React.FC<PropsInput> = ({
    componentRef,
    inputRef,
    className,
    propsComponent,
    propsInput,
    id,
    name,
    value,
    defaultValue,
    type,
    label,
    startAdornment,
    endAdornment,
    placeholder,
    onChange,
    onFocus,
    onBlur,
    onClick,
    onKeyPress,
    onKeyUp,
    onKeyDown,
    disabled,
    required,
    loading,
    autoFocus,
    select,
    valueKey = "value",
    labelKey = "label",
    ilkSec,
    multiline,
    rows,
    sadeceSayi,
    tumuBuyuk,
    tumuKucuk,
    seoCevir,
    dosyaNoGiris,
    dateGecmisKontrol,
    mask = "",
    maskSettings = {
        clearIfNotMatch: true,
        reverse: false, //Tersten doldurmaya başla, fiyatlar için geçerli
    },
}) => {


    const refInput = useRef<any>(null)
    const refMain = useRef<any>(null);
    useEffect(() => {
        if (inputRef) inputRef.current = refInput.current;
    }, [inputRef]);

    useEffect(() => {
        if (componentRef) componentRef.current = refMain.current;
    }, [componentRef]);

    const [inputFilled, setInputFilled] = useState(value && value.toString().length > 0);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        const filled = (String(value) && value.toString().length > 0) || (defaultValue && defaultValue.toString().length > 0);
        setInputFilled(filled);
        if (filled) {
            refMain?.current?.classList?.remove("error");
        }
    }, [value, defaultValue])

    useEffect(() => {
        if (type === "number") sadeceSayi = true;
        if (select && ilkSec && value.toString().length === 0) {
            if (select.length) {
                const ilkItem = (select[0][valueKey]) ? select[0][valueKey] : "";
                onChange && onChange({target: {name, value: ilkItem}})
            }
        }
    }, [select])

    useEffect(() => {
        if (typeof window !== "undefined" && mask?.length > 0) {
            refInput.current?.setAttribute("autocomplete", "off");
        }
    }, [mask])


    const Change = useCallback((e: any) => {
        if (tumuBuyuk) tumuBuyukCevir(e)
        if (tumuKucuk) tumuKucukCevir(e)
        if (seoCevir) seoCevirFunction(e)
        setInputFilled(e.target.value.length > 0)
        onChange ? onChange(e) : null
    }, [onChange]);

    const Focus = useCallback((e: any) => {
        onFocus ? onFocus(e) : null
        setFocus(true);
        refMain?.current?.classList?.remove("error");

        if (mask?.length > 0 && e.target && Inputmask) {
            // @ts-ignore
            $(e.target).mask(mask, maskSettings);
        }

    }, [mask, maskSettings, onFocus])

    const Blur = useCallback((e: any) => {
        if (dosyaNoGiris && e.target.value !== "" && !/^[1-2]\d{3}\/\d/.test(e.target.value)) {
            e.target.value = "";
            if (onChange) onChange(e);
            alert_add({type: "error", message: "Lütfen doğru bir dosya numarası giriniz. Örn: 2022/123"})
        }

        if (dateGecmisKontrol && e.target.value !== "") {
            const today = new Date().toISOString().slice(0, 10);
            if (e.target.value < today) {
                Dialog({
                    message: "Geçmiş bir tarihi seçtiniz. Devam etmek istiyor musunuz?"
                }).then(r => {
                    if (!r) {
                        e.target.value = "";
                        if (onChange) onChange(e);
                        e.target.focus();
                    }
                })
            }
        }

        if (required) {
            if (e.target.value === "") {
                refMain?.current?.classList?.add("error");
            } else {
                refMain?.current?.classList?.remove("error");
            }
        }

        if (value !== e.target.value) {
            onChange && onChange({target: {name, value: e.target.value}})
        }

        onBlur ? onBlur(e) : null;
        setFocus(false);

    }, [value, onBlur]);

    const Click = useCallback((e: any) => onClick ? onClick(e) : null, [onClick])

    const KeyPress = useCallback((e: any) => {
        if ((sadeceSayi || dosyaNoGiris) && (e.which < 48 || e.which > 57)) e.preventDefault();
        if (dosyaNoGiris && e.which !== 8 && e.target.value.length === 4 && e.target.value.search("/") === -1) {
            e.target.value = e.target.value + "/"
        }
        onKeyPress ? onKeyPress(e) : null
    }, [sadeceSayi, dosyaNoGiris, onKeyPress])

    const KeyUp = useCallback((e: any) => onKeyUp ? onKeyUp(e) : null, [onKeyUp])

    const KeyDown = useCallback((e: any) => {
        onKeyDown ? onKeyDown(e) : null
    }, [onKeyDown])

    const ortakProps = {
        ref: refInput,
        id,
        name,
        value,
        defaultValue,
        autoFocus,
        disabled,
        required,
        placeholder,
        onChange: Change,
        onFocus: Focus,
        onBlur: Blur,
        onClick: Click,
        onKeyPress: KeyPress,
        onKeyUp: KeyUp,
        onKeyDown: KeyDown
    }

    let component
    if (select) {
        component = (
            <select className={'input select'} {...ortakProps} {...propsInput}>
                {ilkSec === false && <option value={''}/>}
                {select.map((item: any) => {
                    const value = item[valueKey];
                    const label = item[labelKey];
                    return (
                        <option key={value} value={value}>
                            {label ? label : value}
                        </option>
                    )
                })}
            </select>
        )
    } else if (multiline) {
        component = (
            <textarea
                className={'input textarea'}
                rows={rows}
                {...ortakProps}
                {...propsInput}
            />
        )
    } else {
        component = (
            <input
                className={'input'}
                type={type}
                {...ortakProps}
                {...propsInput}
            />
        )
    }

    const classList = useCallback(() => {
        const list = ['inputcomponent'];
        if (className) list.push(className);
        if (label) {
            list.push("label");
        } else {
            list.push("nolabel");
        }
        // if (props.required && (value.length === 0 || !value)) list.push("error");
        return list.join(' ')
    }, [value, className])

    return (
        <MainBase ref={refMain} className={classList()} data-disabled={disabled} {...propsComponent}>
            {startAdornment && (<div className={'adornment start'}>{startAdornment}</div>)}

            <div className={(inputFilled || focus || (type == "date")) ? 'inputbase open' : 'inputbase'}>
                {component}
                {label && <div className={'label'}>
                    {label}
                    {required && <span className={"required"}>*</span>}
                </div>}
            </div>

            {(endAdornment || loading) && (
                <div className={'adornment end'}>
                    {endAdornment}
                    {loading && <div className={'loading'}/>}
                </div>
            )}
        </MainBase>
    )
}

Input.defaultProps = {
    value: "",
    disabled: false,
    required: false,
    ilkSec: false,
    multiline: false,
    rows: 2,
    loading: false,
    autoFocus: false,
}

const MainBase = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    vertical-align: top;
    width: 100%;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(206, 212, 218);
    box-shadow: none;
    background: #ffffff;
    transition: 0.2s ease all;
    //margin-top: 5px;
    //padding: 2px;
    border-radius: 6px;

    &[data-disabled=true] {
        background: #ebebeb;

        &, & * {
            pointer-events: none;
            cursor: not-allowed;
        }
    }

    &.error {
        border-color: #e70b39;
    }

    &:hover {
        border-color: rgba(63, 77, 103, 0.87);
    }

    &:focus-within {
        box-shadow: inset 0 0 0 1px rgb(63 77 103 / 87%);
    }

    &.label .input:not(:focus)::placeholder {
        color: transparent;
    }

    .inputbase {
        position: relative;
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        flex: 1;
        overflow: hidden;

        &.open {
            position: unset;

            .label {
                background: linear-gradient(0deg,
                #fff 50%,
                rgba(255, 255, 255, 0) 50%);
                background: ${({style}) => {
                    if (style && style['background']) {
                        return (
                                'linear-gradient(0deg, ' +
                                style['background'] +
                                ' 50%, rgba(255, 255, 255, 0) 50%)'
                        )
                    } else if (style && style['backgroundColor']) {
                        return (
                                'linear-gradient(0deg, ' +
                                style['backgroundColor'] +
                                ' 50%, rgba(255, 255, 255, 0) 50%)'
                        )
                    } else {
                        return 'linear-gradient(0deg, #fff 50%, rgba(255, 255, 255, 0) 50%)'
                    }
                }};
                transform: translateY(-50%) scale(0.75);
                top: 1px;
                left: 8px;
                padding: 0 10px;
                color: #3f4d67;
                opacity: 1;
                z-index: 2;
            }
        }

        .input {
            font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
            line-height: 1.8rem;
            letter-spacing: inherit;
            color: currentcolor;
            box-sizing: content-box;
            background: none;
            margin: 0;
            display: block;
            min-width: 0;
            width: 100%;
            //padding: 13.5px 14px;
            padding: 9px 14px;
            border: none;
            outline: none;
            z-index: 1;
            text-overflow: ellipsis;
            border-radius: 6px;


            &[type=number]::-webkit-outer-spin-button,
            &[type=number]::-webkit-inner-spin-button {
                appearance: none;
            }

            &[readonly] {
                cursor: default;
            }

            &:disabled {
                background: #ebebeb;
                cursor: not-allowed;
            }

            &.select {
                padding: 13px 14px;
                margin-right: 5px;
                //appearance: none;
            }

            &.textarea {
                resize: vertical;

                &::-webkit-resizer {
                    display: none;
                }
            }
        }

        .label {
            transition: 0.2s ease all;
            font-size: 1rem;
            line-height: 1.4375em;
            color: #000;
            font-weight: 500;
            padding: 0;
            display: block;
            transform-origin: left top;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: calc(100% - 20px);
            position: absolute;
            left: 14px;
            top: 48%;
            transform: translateY(-50%) scale(1);
            pointer-events: none;
            opacity: 0.5;

            .required {
                margin-left: 4px;
                color: #ff0202;
            }
        }
    }

    .loading {
        position: relative;
        margin: 0 15px;
        width: 24px;
        height: 24px;

        &:before {
            position: absolute;
            display: block;
            content: '';
            z-index: 12;
            top: 2px;
            left: 2px;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #fff;
        }

        &:after {
            position: absolute;
            display: block;
            content: '';
            z-index: 11;
            width: 12px;
            height: 12px;
            border-radius: 200px 0 0;
            background: linear-gradient(45deg,
            rgba(0, 0, 0, 0) 0,
            rgba(69, 154, 215, 1) 50%,
            rgba(69, 154, 215, 1) 100%);
            animation: loading 0.5s linear infinite;
        }

        @keyframes loading {
            0% {
                transform-origin: 100% 100%;
                transform: rotate(0deg);
            }

            100% {
                transform-origin: 100% 100%;
                transform: rotate(360deg);
            }
        }
    }

    &[data-disabled=true] .loading:before {
        background: #ebebeb;
    }

    .adornment {
        height: 0.01em;
        max-height: 2em;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex: 0 0 auto;
        flex-wrap: nowrap;
        white-space: nowrap;

        &.start {
            margin-left: 10px;
            margin-right: -10px;
        }

        &.end {
            margin-left: 10px;
            margin-right: 4px;
        }
    }
`
