/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */


// TODO: Disable olunca da değiştirilebiliyor. Iptal etmek lazım
import React, {useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import styled from 'styled-components'
import {Input, PropsInput} from "./Input";
import {Button} from "./Button";
import {Icon} from "@sydsoft.com.tr/icon";

interface Props extends PropsInput {
    autoCompleteList: { value?: string, label?: string, [key: string | number]: any }[] | any,
    onChange?: Function,
    value?: any,
    valueKey?: string,
    labelKey?: string,
    itemComponent?: any,
    api?: boolean, // api ile çalışıyorsa true gönderin.
    onText?: Function, // Text değiştiğinde tetiklenir.
    onSelect?: Function, // Bir item seçildiğinde tetiklenir.
    newCreate?: boolean, // Yeni bir item oluşturulabilir.
    refModal?: any, // Modal içerisinde kullanılacaksa, modal ref'ini gönderin.
}

type handle = {
    open: () => void;
    close: () => void;
    checkByValue: (value: string, openList: boolean) => void;
    setLoading: (loading: boolean) => void;
};

const Component: React.ForwardRefRenderFunction<handle, Props> = ({
    api = false, onText, onSelect, newCreate = false,
    name, value, autoCompleteList, itemComponent,
    onChange, inputRef, valueKey = "value", labelKey = "label", placeholder, endAdornment,
    refModal = null, ...other
}, forwardedRef) => {
    const isDev = (!process.env.NODE_ENV || process.env.NODE_ENV === "development");

    const refInput = useRef<any>(null)
    const refMain = useRef<any>(null);
    useEffect(() => {
        if (inputRef) inputRef.current = refInput.current;
    }, [inputRef]);

    const refComponentInput = useRef<any>();
    const refList = useRef<any>();

    const [loading, setLoading] = useState<boolean>((!api));
    const [text, setText] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");

    useImperativeHandle(forwardedRef, () => ({
        open: () => {
            setOpen(true);
        },
        close: () => {
            setOpen(false);
        },
        checkByValue: (value: string, openList: boolean = false) => checkByValue(value, openList),
        setLoading: (value) => {
            setLoading(value);
        }
    }));


    useEffect(() => {
        if (refModal) {
            if (open) {
                refModal.current.style.overflow = "visible";
            } else {
                refModal.current.style.overflow = "auto";
                refModal.current.style.overflowX = "hidden";
            }
        }
    }, [open])

    useEffect(() => {
        if (!api) setLoading(false);
    }, [])

    useEffect(() => {
        if (api && Object.keys(autoCompleteList).length > 0) checkByValue(value, open);
    }, [autoCompleteList])

    useEffect(() => {
        if (Object.keys(autoCompleteList).length > 0) {
            if (value.toString().length > 0) {
                checkByValue(value.toString(), open);
            } else {
                if (!api) clear(false);
            }
        }
    }, [value])

    useEffect(() => {
        const checkHideBackDrop = (e: any) => {
            if (open && refMain.current && !refMain.current.contains(e.target)) {
                checkByInput();
            }
        }
        const checkESC = (e: any) => {
            if (e.keyCode === 27 || e.key === "Escape" || e.code === "Escape") checkByInput();
        }
        if (open) {
            setScroll();
        }

        window.addEventListener("mousedown", checkHideBackDrop)
        window.addEventListener("keydown", checkESC);
        isDev && console.log("useEffect", "open+autoCompleteList", autoCompleteList);
        return () => {
            isDev && console.log("useEffect-unMount", "open+autoCompleteList");
            window.removeEventListener("mousedown", checkHideBackDrop);
            window.removeEventListener("keydown", checkESC);
        }
    }, [autoCompleteList, open])
    const isString = (value: any) => typeof value === 'string' || value instanceof String;
    const cevirTumuKucuk = (text: any = "") => {
        if (!isString(text)) return text;
        return text.toString().toLocaleLowerCase("tr-TR")
    }
    const convertForSearch = (value: string) => {
        let data = cevirTumuKucuk(value);
        data = data.replace(/ö/g, 'o');
        data = data.replace(/ç/g, 'c');
        data = data.replace(/ş/g, 's');
        data = data.replace(/ı/g, 'i');
        data = data.replace(/ğ/g, 'g');
        data = data.replace(/ü/g, 'u');
        data = data.replace(/[^a-z\d]/g, ""); // %_- are allowed
        data = data.replace(/^\s+|\s+$/g, "");
        return data;
    };

    const data = useMemo(() => {
        let list: any[];
        if (filter.length > 0) {
            list = Object.values(autoCompleteList).filter((item: any) => {
                return convertForSearch(item[labelKey]).includes(convertForSearch(filter)) || item[labelKey] == filter;
            })
        } else {
            list = autoCompleteList;
        }

        if (newCreate && text.length > 0) {
            const filterText = Object.values(autoCompleteList).find((item: any) => (item[labelKey].toString().toLowerCase() === text.toString().toLowerCase()));
            if (!filterText) {
                list = [{[labelKey]: text, [valueKey]: text, create: true}, ...list];
            }
        }
        return list;
    }, [autoCompleteList, filter])

    const Change = (e: any) => {
        setValue(false, true);
        setText(e.target.value);
        setFilter(e.target.value);
        setOpen(true);
        if (onText) onText(e.target.value);
    };

    const setValue = (result: any, openList: boolean) => {
        if (onSelect) onSelect(result);
        setOpen(openList);
        const newValue = (result && result[valueKey]) ? result[valueKey] : "";
        if (result) {
            const newLabel = (result && result[labelKey]) ? result[labelKey] : "";
            setText(newLabel);
        }
        setFilter("");
        if (onChange && newValue != value) {
            isDev && console.log("onChange", newValue, value);
            onChange({
                target: {
                    name,
                    value: newValue
                }
            })
        }

    };

    const checkByValue = (value: string, openList: boolean = false) => {
        setValue(Object.values(autoCompleteList).find((item: any) => (item[valueKey].toString().toLowerCase() === value.toString().toLowerCase())), openList);
    }

    const checkByInput = () => {
        isDev && console.log("checkByInput", refInput.current.value, autoCompleteList);
        const findByLabel: any = Object.values(autoCompleteList).find((item: any) => (item[labelKey].toString().toLowerCase() === refInput.current.value.toLowerCase()));
        if (findByLabel && value == findByLabel[valueKey]) {
            setOpen(false);
            isDev && console.log("findByLabel - Zaten Aynı", findByLabel);
            return;
        }
        setValue(findByLabel, false);
        if (!findByLabel) setText("");

        if (api && !findByLabel && Object.keys(autoCompleteList).length === 0) {
            if (onText) onText("");
        }
    };

    const clear = (openList: boolean = true, focusInput: boolean = false) => {
        setFilter("");
        setText("");
        setValue(false, openList);
        if (onText) onText("");
        if (focusInput) refInput?.current?.focus();
    };

    function setScroll() {
        if (refList.current) {
            let position = 0;
            const text = refList.current.querySelector("li.item.selected");
            if (text) {
                position = text.offsetTop - 35;
            } else if (refList.current.querySelector("li.item.active")) {
                position = refList.current.querySelector("li.item.active").offsetTop - 35;
            }
            refList.current.scrollTop = position;
        }
    }

    const onKeyDown = (e: any) => {
        if (!open) return null;

        function selectEnter() {
            const text = refList.current.querySelector("li.item.selected");
            if (text) {
                checkByValue(text.dataset.value);
            } else if (refList.current.querySelectorAll("li.item").length > 0) {
                checkByValue((refList.current.querySelectorAll("li.item")[0].dataset.value));
            } else {
                clear(true, true);
            }
        }

        function selectFirst() {
            const showList = refList.current.querySelectorAll("li.item");
            if (showList.length > 0) {
                showList[0].classList.add("selected");
            }
        }

        function selectLast() {
            const showList = refList.current.querySelectorAll("li.item");
            if (showList.length > 0) {
                showList[showList.length - 1].classList.add("selected");
            }
        }

        function selectNext(element: any) {
            element.classList.remove("selected");
            const next = element.nextElementSibling;
            if (next && next.nodeType !== -1) {
                if (next.classList.contains("item")) {
                    next.classList.add("selected");
                } else {
                    selectNext(next)
                }
            } else {
                selectFirst();
            }
        }

        function selectPrev(element: any) {
            element.classList.remove("selected");
            const next = element.previousElementSibling;
            if (next && next.nodeType !== -1) {
                if (next.classList.contains("item")) {
                    next.classList.add("selected");
                } else {
                    selectPrev(next)
                }
            } else {
                selectLast();
            }
        }

        const selected = refList.current.querySelector("li.item.selected");
        if (e.which == 40) {
            if (selected) {
                selectNext(selected);
            } else {
                selectFirst();
            }
        } else if (e.which == 38) {
            if (selected) {
                selectPrev(selected);
            } else {
                selectLast();
            }
        } else if (e.which == 35) {
            selectLast();
        } else if (e.which == 36) {
            selectFirst();
        } else if (e.which == 13) {
            selectEnter();
        } else if (e.which == 9) {
            checkByInput();
        }

        setScroll();
    };

    return <MainBase
        ref={refMain}
        onKeyDown={onKeyDown}
    >
        <Input
            {...other}
            name={name}
            value={text}
            inputRef={refInput}
            componentRef={refComponentInput}
            onFocus={() => setOpen(true)}
            onChange={Change}
            endAdornment={
                <div style={{marginRight: 5}} tabIndex={-1}>
                    <Button title={"Temizle"} tabIndex={-1} hidden={!(text && text.length > 0)} onClick={() => clear(true, true)} onlyIcon={<Icon iconMui={"clear"} style={{color: "#444"}}/>}/>
                    {endAdornment}
                    <Button tabIndex={-1} hidden={!(Object.keys(autoCompleteList).length > 0)} onClick={() => setOpen(!open)} onlyIcon={<Icon iconMui={(open) ? "keyboard_arrow_up" : "keyboard_arrow_down"} style={{color: "#444"}}/>}/>
                </div>
            }
            placeholder={(loading) ? "Lütfen bekleyiniz..." : placeholder}
            loading={loading}
            propsInput={{
                ...other?.propsInput,
                autoComplete: "off"
            }}
        />

        <div className={"list"}>
            <ul ref={refList} className={(open) ? "open" : ""}>
                {(Object.keys(data).length === 0 || loading) && (<div className={(loading) ? "message loading" : "message"}>{(loading) ? "Lütfen bekleyiniz..." : "Kayıt bulunamadı..."}</div>)}
                {Object.values(data).map((item: any, key: number) => {
                    const itemValue = item[valueKey];
                    const itemLabel = item[labelKey];
                    return <li key={key}
                               className={(itemValue === value) ? "item active" : "item"}
                               data-value={itemValue}
                               data-label={itemLabel}
                               onClick={() => setValue(item, false)}
                    >
                        {item.create && <span className={"create"}>Yeni Oluştur:</span>}
                        {(itemComponent) ? itemComponent(item) : itemLabel}
                    </li>
                })}
            </ul>
        </div>

    </MainBase>
}

export const SearchableInput = React.forwardRef(Component);


const MainBase = styled.div`
    .inputbase > .input {
        padding: 9.4px 9.4px 9.4px 14px;
    }

    .list {
        position: relative;
        margin-top: -4px;
        z-index: 1000;

        ul {
            position: absolute;
            top: 3px;
            left: 1%;
            width: 98%;
            height: 0;
            overflow: hidden;
            background: transparent;
            margin: 0;
            padding: 0;
            list-style: none;

            &.open {
                height: auto;
                max-height: 300px;
                overflow-x: hidden;
                overflow-y: visible;
                //scroll-behavior: smooth;
                padding: 5px 0;
                border: 1px #ced4da solid;
                background: #fff;
            }

            li {
                cursor: pointer;
                display: block;
                padding: 8px 10px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;

                &:hover, &.selected {
                    background: #d9e0e3;
                }

                &.active {
                    background: #e1eff7;
                    font-weight: 500;
                }

                .create {
                    margin-right: 5px;
                    font-style: italic;
                }
            }

            .message {
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                display: block;
                padding: 15px 10px;
                cursor: default;

                &.loading {
                    padding: 5px 10px;
                    background-color: #ced4da38;
                    text-align: center;
                }
            }
        }
    }
`