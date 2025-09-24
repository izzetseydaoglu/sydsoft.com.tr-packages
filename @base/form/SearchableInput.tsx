import React, { useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Input, PropsInput } from './Input';

import { isDev } from '../_lib/baseFunctions';
import { Icon } from '../icon';
import { Button } from './Button';
import styles from './styles/SearchableInput.module.css';

type typeList = {
    value?: string;
    label?: string;
    [key: string | number]: any;
}[];

interface Props extends PropsInput {
    autoCompleteList?: typeList;
    onChange?: (e: any) => void;
    value: string | number | undefined;
    valueKey?: string;
    labelKey?: string;
    itemComponent?: any;
    isDataFromApi?: boolean; // api ile çalışıyorsa true gönderin.
    parentInputValue?: string | number | undefined; // Eğer bu input bir başka inputa bağlı ise, o inputun value'sunu gönderin. (örneğin; şehir - ilçe)
    onText?: (text: string) => void; // Text değiştiğinde tetiklenir.
    onSelect?: (item: any) => void; // Bir item seçildiğinde tetiklenir.
    onLoad?: (value: string | number) => void; // Component hazır olduğunda tetiklenir.
    newCreate?: boolean; // Yeni bir item oluşturulabilir.
    style?: React.CSSProperties;
    disabled?: boolean;
    listPositionRelative?: boolean; // Liste pozisyonu relative olacaksa true gönderin. (Varsayılan absolute)
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
        autoCompleteList = [],
        isDataFromApi = false,
        onText,
        onSelect,
        onLoad,
        onChange,
        newCreate = false,
        name,
        value,
        itemComponent,
        inputRef,
        valueKey = 'value',
        labelKey = 'label',
        placeholder,
        endAdornment,
        style,
        disabled,
        parentInputValue,
        listPositionRelative = false,
        ...other
    },
    forwardedRef
) => {
    const refMain = useRef<any>(null);
    const refInput = useRef<any>(null);

    const refComponentInput = useRef<any>(null);
    const refList = useRef<any>(null);

    const [data, setData] = useState<any[]>([]);
    const [text, setText] = useState<string>(''); //Inputta görünen
    const [filter, setFilter] = useState<string>(''); // Filtrelemeye tabi tutulan
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(isDataFromApi && autoCompleteList.length === 0);
    const [newItemCreate, setNewItemCreate] = useState<any>({ created: false });

    useImperativeHandle(forwardedRef, () => ({
        open: () => {
            setOpen(true);
            refInput.current && refInput.current.focus();
        },
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

    const handleUpdatePosition = () => {
        if (open && !listPositionRelative && refMain) {
            setFixedPosition(refMain);
        }
    };

    useEffect(() => {
        if (onLoad) onLoad(value ?? '');
    }, []);

    useEffect(() => {
        if (inputRef) inputRef.current = refInput.current;
    }, [refInput.current]);

    useEffect(() => {
        if (parentInputValue !== undefined && parentInputValue !== null) {
            clear(false);
            isDev && console.log(name, 'parentInputValueDeğişti =>', parentInputValue);
        }
    }, [parentInputValue]);

    useEffect(() => {
        if (autoCompleteList && Array.isArray(autoCompleteList) && autoCompleteList.length > 0) {
            setData(autoCompleteList);
            isDev && console.log('autoCompleteList =>', name, autoCompleteList);
        }
    }, [autoCompleteList]);

    useEffect(() => {
        if (!isDataFromApi && data.length > 0) checkByValue(value, open);
    }, [data]);

    useEffect(() => {
        if (data.length > 0) {
            if (value && value.toString().length > 0) {
                checkByValue(value, open);
            } else {
                if (!isDataFromApi) clear(false);
            }
        }
    }, [value]);

    useEffect(() => {
        const checkHideBackDrop = (e: any) => {
            if (open && refMain.current && !refMain.current.contains(e.target)) {
                checkByInput();
            }
        };
        const checkESC = (e: any) => {
            if (e.keyCode === 27 || e.key === 'Escape' || e.code === 'Escape') checkByInput();
        };

        window.addEventListener('mousedown', checkHideBackDrop);
        if (refMain.current) refMain.current.addEventListener('keydown', checkESC);

        if (open) {
            setScrollPosition();
            if (!listPositionRelative) {
                window.addEventListener('scroll', handleUpdatePosition, true);
                window.addEventListener('resize', handleUpdatePosition);
            }
        }

        return () => {
            window.removeEventListener('mousedown', checkHideBackDrop);
            if (refMain.current) refMain.current.removeEventListener('keydown', checkESC);
            window.removeEventListener('scroll', handleUpdatePosition, true);
            window.removeEventListener('resize', handleUpdatePosition);
        };
    }, [open]);

    useLayoutEffect(() => handleUpdatePosition(), [open]);

    const cevirTumuKucuk = (text: any = '') => {
        return text.toString().toLocaleLowerCase('tr-TR');
    };
    const convertForSearch = useCallback(
        (value: string) => {
            let data = cevirTumuKucuk(value);
            data = data.replace(/ö/g, 'o');
            data = data.replace(/ç/g, 'c');
            data = data.replace(/ş/g, 's');
            data = data.replace(/ı/g, 'i');
            data = data.replace(/ğ/g, 'g');
            data = data.replace(/ü/g, 'u');
            data = data.replace(/[^a-z\d]/g, ''); // %_- are allowed
            data = data.replace(/^\s+|\s+$/g, '');
            return data;
        },
        [cevirTumuKucuk]
    );

    const filteredData = useMemo(() => {
        let list: any[];
        if (filter.length > 0) {
            list = data.filter((item: any) => convertForSearch(item[labelKey]).includes(convertForSearch(filter)) || item[labelKey] == filter);
        } else {
            list = data;
        }

        if (newCreate && text.length > 0) {
            const filterText = data.find((item: any) => item[labelKey].toString().toLowerCase() === text.toString().toLowerCase());
            if (!filterText) {
                const newItem = { [labelKey]: text, [valueKey]: text, create: true };
                list = [newItem, ...list];
                setNewItemCreate(newItem);
            } else {
                if (newItemCreate.create) setNewItemCreate({ create: false });
            }
        }
        return list;
    }, [data, filter, newCreate, text, valueKey, labelKey]);

    const setValue = useCallback(
        (result: any, openList: boolean) => {
            setOpen(openList);
            const newValue = result && result[valueKey] ? result[valueKey] : '';
            if (result) {
                const newLabel = result && result[labelKey] ? result[labelKey] : '';
                setText(newLabel);
            }
            setFilter('');

            if (onChange && newValue != value) {
                onChange({
                    target: {
                        name,
                        value: newValue
                    }
                });
            }
            if (onSelect) onSelect(result);
        },
        [onChange, onSelect, name, value, valueKey, labelKey]
    );

    const Change = useCallback(
        (e: any) => {
            setValue(false, true);
            setText(e.target.value);
            setFilter(e.target.value.trim());
            setOpen(true);
            if (onText) onText(e.target.value);
        },
        [setValue, onText]
    );

    const checkByValue = useCallback(
        (value: any, openList: boolean = false, list: typeList = []) => {
            const targetList = list.length > 0 ? list : data;
            let find = Object.values(targetList).find((item: any) => cevirTumuKucuk(item[valueKey]) === cevirTumuKucuk(value));
            if (!find && newCreate && newItemCreate.create) {
                find = newItemCreate;
            }
            setValue(find, openList);
        },
        [data, valueKey, newCreate, newItemCreate, setValue]
    );

    const checkByInput = useCallback(() => {
        const findByLabel: any = data.find((item: any) => cevirTumuKucuk(item[labelKey]) === cevirTumuKucuk(refInput.current.value));
        if (findByLabel && value == findByLabel[valueKey]) {
            setOpen(false);
            return;
        }
        setValue(findByLabel, false);
        if (!findByLabel) setText('');

        if (isDataFromApi && !findByLabel && data.length === 0) {
            if (onText) onText('');
        }
    }, [data, labelKey, value, valueKey, isDataFromApi, onText, setValue]);

    const clear = useCallback(
        (openList: boolean = true, focusInput: boolean = false) => {
            setFilter('');
            setText('');
            setValue(false, openList);
            if (onText) onText('');
            if (focusInput) refInput?.current?.focus();
        },
        [setValue, onText]
    );

    function setScrollPosition() {
        if (refList.current) {
            let position = 0;
            const text = refList.current.querySelector('li.item.selected');
            if (text) {
                position = text.offsetTop - 35;
            } else if (refList.current.querySelector('li.item.active')) {
                position = refList.current.querySelector('li.item.active').offsetTop - 35;
            }
            refList.current.scrollTop = position;
        }
    }

    const onKeyDown = (e: any) => {
        if (!open) return null;

        function selectEnter() {
            const text = refList.current.querySelector('li.item.selected');
            if (text) {
                checkByValue(text.dataset.value);
            } else if (refList.current.querySelectorAll('li.item').length > 0) {
                checkByValue(refList.current.querySelectorAll('li.item')[0].dataset.value);
            } else {
                clear(true, true);
            }
        }

        function selectFirst() {
            const showList = refList.current.querySelectorAll('li.item');
            if (showList.length > 0) {
                showList[0].classList.add('selected');
            }
        }

        function selectLast() {
            const showList = refList.current.querySelectorAll('li.item');
            if (showList.length > 0) {
                showList[showList.length - 1].classList.add('selected');
            }
        }

        function selectNext(element: any) {
            element.classList.remove('selected');
            const next = element.nextElementSibling;
            if (next && next.nodeType !== -1) {
                if (next.classList.contains('item')) {
                    next.classList.add('selected');
                } else {
                    selectNext(next);
                }
            } else {
                selectFirst();
            }
        }

        function selectPrev(element: any) {
            element.classList.remove('selected');
            const next = element.previousElementSibling;
            if (next && next.nodeType !== -1) {
                if (next.classList.contains('item')) {
                    next.classList.add('selected');
                } else {
                    selectPrev(next);
                }
            } else {
                selectLast();
            }
        }

        const selected = refList.current.querySelector('li.item.selected');
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
        <div ref={refMain} className={styles.searchableInputComponent} onKeyDown={onKeyDown} style={style}>
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
                                title={'Temizle'}
                                tabIndex={-1}
                                hidden={!(text && text.length > 0)}
                                onClick={() => clear(true, true)}
                                onlyIcon={<Icon name={'close'} style={{ color: '#444' }} />}
                            />
                            {endAdornment}
                            <Button
                                tabIndex={-1}
                                hidden={!(data.length > 0)}
                                onClick={() => setOpen(!open)}
                                onlyIcon={<Icon name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} style={{ color: '#444' }} />}
                            />
                        </div>
                    )
                }
                placeholder={loading ? 'Lütfen bekleyiniz...' : placeholder}
                loading={loading}
                disabled={disabled}
                propsInput={{
                    ...other?.propsInput,
                    autoComplete: 'off'
                }}
            />
            {open && (
                <div className={'listDiv'} data-relative={listPositionRelative}>
                    <ul ref={refList} className={`list ${open ? 'open' : ''}`}>
                        {(filteredData.length === 0 || loading) && <div className={`message ${loading ? 'loading' : ''}`}>{loading ? 'Lütfen bekleyiniz...' : 'Kayıt bulunamadı...'}</div>}
                        {filteredData.map((item: any, key: number) => {
                            const itemValue = item[valueKey];
                            const itemLabel = item[labelKey];
                            return (
                                <li key={key} className={`item ${itemValue === value ? 'active' : ''}`} data-value={itemValue} data-label={itemLabel} onClick={() => setValue(item, false)}>
                                    {item.create && <span className={'newCreate'}>Yeni Oluştur: </span>}
                                    {itemComponent ? itemComponent(item) : itemLabel}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export const SearchableInput = React.forwardRef(Component);

const setFixedPosition = (refMain: any) => {
    if (!refMain.current) return;
    const target = refMain.current;
    const targetPosition = target.getBoundingClientRect();
    const listDiv = target.querySelector('.listDiv');

    if (listDiv) {
        const listDivUL = target.querySelector('ul');
        if (!listDiv) return;

        const listHeight = listDivUL.getBoundingClientRect().height;

        const style = [];
        style.push(`position:fixed`);
        style.push(`z-index:111111111111 !important`);
        style.push(`width:${targetPosition.width}px`);

        const spaceBelow = window.innerHeight - (targetPosition.top + targetPosition.height);
        const spaceAbove = targetPosition.top;
        if (spaceBelow < listHeight && spaceAbove > listHeight) {
            style.push(`top:${targetPosition.top - listHeight}px`);
            style.push(`margin-top:-1px`);
        } else {
            style.push(`top:${targetPosition.top + targetPosition.height}px`);
        }
        listDiv.setAttribute('style', style.join(';'));
    }
};
