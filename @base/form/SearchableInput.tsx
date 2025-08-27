import { Icon, isDev } from "@/@base";
import { Input, PropsInput } from "./Input";
import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";

import { Button } from "./Button";
import styles from "./styles/SearchableInput.module.css";

type typeList = {
    value?: string;
    label?: string;
    [key: string | number]: any;
}[];

interface Props extends PropsInput {
    autoCompleteList?: typeList | any;
    onChange?: Function;
    value: string | number | undefined;
    valueKey?: string;
    labelKey?: string;
    itemComponent?: any;
    api?: boolean; // api ile çalışıyorsa true gönderin.
    onText?: Function; // Text değiştiğinde tetiklenir.
    onSelect?: Function; // Bir item seçildiğinde tetiklenir.
    onLoad?: Function; // Component hazır olduğunda tetiklenir.
    newCreate?: boolean; // Yeni bir item oluşturulabilir.
    refModal?: any; // Modal içerisinde kullanılacaksa, modal ref'ini gönderin.
    style?: React.CSSProperties;
    disabled?: boolean;
    parentInputValue?: any;
    listPositionRelative?: boolean;
}

type handle = {
    open: () => void;
    close: () => void;
    checkByValue: (value: string, openList: boolean) => void;
    setLoading: (loading: boolean) => void;
    setAutoCompleteList: (list: typeList, value?: string | null) => void;
    clear: (openList?: boolean, focusInput?: boolean) => void;
};

const Component: React.ForwardRefRenderFunction<handle, Props> = (
    {
        api = false,
        onText,
        onSelect,
        onLoad,
        newCreate = false,
        name,
        value,
        autoCompleteList = [],
        itemComponent,
        onChange,
        inputRef,
        valueKey = "value",
        labelKey = "label",
        placeholder,
        endAdornment,
        refModal,
        style,
        disabled,
        parentInputValue,
        listPositionRelative,
        ...other
    },
    forwardedRef
) => {
    const refMain = useRef<any>(null);
    const refInput = useRef<any>(null);
    useEffect(() => {
        if (inputRef) inputRef.current = refInput.current;
    }, [refInput.current]);

    const refComponentInput = useRef<any>();
    const refList = useRef<any>();

    const [data, setData] = useState<any[]>(autoCompleteList);
    const [text, setText] = useState<string>(""); //Inputta görünen
    const [filter, setFilter] = useState<string>(""); // Filtrelemeye tabi tutulan
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(api);

    useEffect(() => {
        if (onLoad) onLoad(value ?? "");
    }, []);

    useImperativeHandle(forwardedRef, () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
        checkByValue: (value: string, openList: boolean = false) => checkByValue(value, openList),
        setLoading: (value) => setLoading(value),
        setAutoCompleteList: (list: typeList, value = null) => {
            setData(list);
            if (value) checkByValue(value, false, list);
            setLoading(false);
        },
        clear: (openList: boolean = false, focusInput: boolean = false) => clear(openList, focusInput)
    }));

    useEffect(() => {
        if (parentInputValue) {
            clear(false);
        }
    }, [parentInputValue]);

    useEffect(() => {
        if (!api && Object.keys(data).length > 0) checkByValue(value, open);
        // if (Object.keys(data).length > 0) checkByValue(value, open);
        isDev && console.log("useDeepCompareEffect =>", name, "data");
    }, [data]);

    useEffect(() => {
        if (Object.keys(data).length > 0) {
            if (value && value.toString().length > 0) {
                checkByValue(value, open);
            } else {
                if (!api) clear(false);
            }
        }
        isDev && console.log("useEffect-value =>", name, value);
    }, [value]);

    useEffect(() => {
        const checkHideBackDrop = (e: any) => {
            if (open && refMain.current && !refMain.current.contains(e.target)) {
                checkByInput();
            }
        };
        const checkESC = (e: any) => {
            if (e.keyCode === 27 || e.key === "Escape" || e.code === "Escape") checkByInput();
        };

        window.addEventListener("mousedown", checkHideBackDrop);
        if (refMain.current) refMain.current.addEventListener("keydown", checkESC);
        return () => {
            window.removeEventListener("mousedown", checkHideBackDrop);
            if (refMain.current) refMain.current.removeEventListener("keydown", checkESC);
        };
    }, [data, open]);

    useEffect(() => {
        if (refModal && refModal.current) {
            if (open) {
                refModal.current.style.overflow = "visible";
            } else {
                refModal.current.style.overflow = "auto overlay";
            }
        }
        if (open) {
            setScrollPosition();

            if (refModal && refModal.current && refMain && refMain.current) {
                refModal.current.scrollTop = refMain.current.offsetTop + 300;
            }
        }
    }, [open]);

    const cevirTumuKucuk = (text: any = "") => {
        return text.toString().toLocaleLowerCase("tr-TR");
    };
    const convertForSearch = (value: string) => {
        let data = cevirTumuKucuk(value);
        data = data.replace(/ö/g, "o");
        data = data.replace(/ç/g, "c");
        data = data.replace(/ş/g, "s");
        data = data.replace(/ı/g, "i");
        data = data.replace(/ğ/g, "g");
        data = data.replace(/ü/g, "u");
        data = data.replace(/[^a-z\d]/g, ""); // %_- are allowed
        data = data.replace(/^\s+|\s+$/g, "");
        return data;
    };

    const filteredData = useMemo(() => {
        let list: any[];
        if (filter.length > 0) {
            list = Object.values(data).filter((item: any) => {
                return convertForSearch(item[labelKey]).includes(convertForSearch(filter)) || item[labelKey] == filter;
            });
        } else {
            list = data;
        }

        if (newCreate && text.length > 0) {
            const filterText = Object.values(data).find((item: any) => item[labelKey].toString().toLowerCase() === text.toString().toLowerCase());
            if (!filterText) {
                list = [{ [labelKey]: text, [valueKey]: text, create: true }, ...list];
            }
        }
        return list;
    }, [data, filter]);

    const Change = (e: any) => {
        setValue(false, true);
        setText(e.target.value);
        setFilter(e.target.value);
        setOpen(true);
        if (onText) onText(e.target.value);
    };

    const setValue = (result: any, openList: boolean) => {
        setOpen(openList);
        const newValue = result && result[valueKey] ? result[valueKey] : "";
        if (result) {
            const newLabel = result && result[labelKey] ? result[labelKey] : "";
            setText(newLabel);
        }
        setFilter("");
        if (onChange && newValue != value) {
            isDev && console.log("onChange =>", name, "yeni:" + newValue, "eski:" + value);
            onChange({
                target: {
                    name,
                    value: newValue
                }
            });
        }
        if (onSelect) onSelect(result);
    };

    const checkByValue = (value: any, openList: boolean = false, list: typeList = []) => {
        const targetList = list.length > 0 ? list : data;
        const find = Object.values(targetList).find((item: any) => cevirTumuKucuk(item[valueKey]) === cevirTumuKucuk(value));
        setValue(find, openList);
    };

    const checkByInput = () => {
        isDev && console.log("checkByInput =>", name, refInput.current.value, data);
        const findByLabel: any = Object.values(data).find((item: any) => cevirTumuKucuk(item[labelKey]) === cevirTumuKucuk(refInput.current.value));
        if (findByLabel && value == findByLabel[valueKey]) {
            setOpen(false);
            isDev && console.log("findByLabel - Zaten Aynı =>", name, findByLabel);
            return;
        }
        setValue(findByLabel, false);
        if (!findByLabel) setText("");

        if (api && !findByLabel && Object.keys(data).length === 0) {
            if (onText) onText("");
        }
    };

    const clear = (openList: boolean = true, focusInput: boolean = false) => {
        setFilter("");
        setText("");
        setValue(false, openList);
        if (onText) onText("");
        if (focusInput) refInput?.current?.focus();
        isDev && console.log("clear");
    };

    function setScrollPosition() {
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
                checkByValue(refList.current.querySelectorAll("li.item")[0].dataset.value);
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
                    selectNext(next);
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
                    selectPrev(next);
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

        setScrollPosition();
    };

    return (
        <div ref={refMain} className={styles.component} onKeyDown={onKeyDown} style={style}>
            <Input
                {...other}
                name={name}
                value={text}
                inputRef={refInput}
                componentRef={refComponentInput}
                onFocus={() => setOpen(true)}
                onChange={Change}
                endAdornment={
                    !disabled && (
                        <div style={{ marginRight: 5 }} tabIndex={-1}>
                            <Button
                                title={"Temizle"}
                                tabIndex={-1}
                                hidden={!(text && text.length > 0)}
                                onClick={() => clear(true, true)}
                                onlyIcon={<Icon iconMui={"clear"} style={{ color: "#444" }} />}
                            />
                            {endAdornment}
                            <Button
                                tabIndex={-1}
                                hidden={!(Object.keys(data).length > 0)}
                                onClick={() => setOpen(!open)}
                                onlyIcon={<Icon iconMui={open ? "keyboard_arrow_up" : "keyboard_arrow_down"} style={{ color: "#444" }} />}
                            />
                        </div>
                    )
                }
                placeholder={loading ? "Lütfen bekleyiniz..." : placeholder}
                loading={loading}
                disabled={disabled}
                propsInput={{
                    ...other?.propsInput,
                    autoComplete: "off"
                }}
            />

            <div className={styles.listDiv} data-relative={listPositionRelative}>
                <ul ref={refList} className={`${styles.list} ${open ? styles.open : ""}`}>
                    {(Object.keys(filteredData).length === 0 || loading) && (
                        <div className={`${styles.message} ${loading ? styles.loading : ""}`}>{loading ? "Lütfen bekleyiniz..." : "Kayıt bulunamadı..."}</div>
                    )}
                    {Object.values(filteredData).map((item: any, key: number) => {
                        const itemValue = item[valueKey];
                        const itemLabel = item[labelKey];
                        return (
                            <li
                                key={key}
                                className={`${styles.listItem} ${itemValue === value ? styles.active : ""}`}
                                data-value={itemValue}
                                data-label={itemLabel}
                                onClick={() => setValue(item, false)}>
                                {item.create && <span className={styles.newCreate}>Yeni Oluştur: </span>}
                                {itemComponent ? itemComponent(item) : itemLabel}
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

export const SearchableInput = React.forwardRef(Component);
