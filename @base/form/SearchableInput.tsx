import { Button, Input, PropsInput } from './index';
import { convertForSearch, convertLowerCase } from '../_lib/baseFunctions';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { onKeyboardSelection, setScrollListPosition } from '../_lib/listFunctions';

import { Icon } from '../icon';
import styles from './styles/SearchableInput.module.css';

type typeList = {
    value?: string;
    label?: string;
    [key: string]: any;
};

type typeValue = string | number | undefined;

interface Props extends PropsInput {
    autoCompleteList?: typeList[];
    isDataFromApi: boolean;
    value: typeValue;
    valueKey?: string;
    labelKey?: string;
    itemComponent?: (option: typeList) => React.ReactNode;
    parentInputValue?: typeValue; // Eğer bu input bir başka inputa bağlı ise, o inputun value'sunu gönderin. (örneğin; şehir - ilçe)
    onChange?: (e: any) => void;
    onText?: (text: string) => void; // Text değiştiğinde tetiklenir.
    onSelect?: (item: any) => void; // Bir item seçildiğinde tetiklenir.
    onLoad?: (value: typeValue) => void; // Component hazır olduğunda tetiklenir.
    ilkSec?: boolean;
    newCreate?: boolean; // Yeni bir item oluşturulabilir.
    style?: React.CSSProperties;
    disabled?: boolean;
    listPositionRelative?: boolean; // Liste pozisyonu relative olacaksa true gönderin. (Varsayılan absolute)
    loadingMessage?: string;
    notFoundMessage?: string;
}

export interface SearchableInputRef {
    setAutoCompleteList: (list: typeList[], value?: typeValue, callback?: () => void) => void;
    clear: (openList?: boolean, focusInput?: boolean) => void;
    open: () => void;
    close: () => void;
    checkByValue: (value: typeValue, openList?: boolean) => void;
    setLoading: (loading: boolean) => void;
}

export const SearchableInput = forwardRef<SearchableInputRef, Props>(
    (
        {
            autoCompleteList = [],
            isDataFromApi,
            name,
            value,
            parentInputValue,
            disabled,
            itemComponent,
            valueKey = 'value',
            labelKey = 'label',
            onSelect,
            onChange,
            onText,
            onLoad,
            style,
            listPositionRelative = false,
            loadingMessage = 'Lütfen bekleyiniz...',
            notFoundMessage = 'Kayıt bulunamadı...',
            placeholder,
            endAdornment,
            ilkSec = false,
            newCreate = false,
            inputRef,
            ...other
        },
        ref
    ) => {
        const refMain = useRef<HTMLDivElement>(null);
        const refInput = useRef<HTMLInputElement>(null);
        const refList = useRef<HTMLUListElement>(null);

        const [data, setData] = useState<typeList[]>(autoCompleteList ?? []);
        const [selectedValue, setSelectedValue] = useState<typeValue>(value ?? undefined);
        const [parentValue, setParentValue] = useState<typeValue>(parentInputValue ?? undefined);
        const [text, setText] = useState<string>(''); //Inputta görünen
        const [filter, setFilter] = useState<string>(''); // Filtrelemeye tabi tutulan
        const [newItemCreate, setNewItemCreate] = useState<typeList>({ created: false });
        const [open, setOpen] = useState<boolean>(false);
        const [loading, setLoading] = useState<boolean>(isDataFromApi && (!autoCompleteList || autoCompleteList?.length == 0));

        useImperativeHandle(
            ref,
            () => ({
                setAutoCompleteList: (list: typeList[], value: typeValue = undefined, callback?: () => void) => {
                    if (autoCompleteList && autoCompleteList?.length > 0) {
                        alert('AutoCompleteList zaten tanımlı olduğundan dışardan data seti değiştirilemez.');
                        return;
                    }
                    setData(list);
                    value && sendChange(value);
                    setLoading(false);
                    if (!Array.isArray(list) || list.length == 0) {
                        clear(false);
                    }
                    callback && callback();
                    //   isDev && console.log("setAutoCompleteList =>", name, value, list);
                },
                clear: (openList: boolean = false, focusInput: boolean = false) => clear(openList, focusInput),
                open: () => {
                    setOpen(true);
                    refInput.current && refInput.current.focus();
                },
                close: () => setOpen(false),
                checkByValue: (value: typeValue, openList: boolean = false) => checkByValue(value, openList),
                setLoading: (value) => setLoading(value)
            }),
            [autoCompleteList, data, value]
        );

        useEffect(() => {
            if (inputRef) inputRef.current = refInput.current;
        }, [refInput.current]);

        useEffect(() => onLoad && onLoad(value), []);

        useEffect(() => {
            if (autoCompleteList && Array.isArray(autoCompleteList)) {
                if (autoCompleteList.length > 0) {
                    // Sadece gerçekten farklıysa set et
                    if (JSON.stringify(autoCompleteList) !== JSON.stringify(data)) {
                        setData(autoCompleteList);
                        // isDev && console.log("autoCompleteList dolu =>", name, autoCompleteList);
                    }
                } else {
                    // Boş array geldi VE data zaten boş değilse
                    if (data.length > 0) {
                        setData([]);
                        // isDev && console.log("autoCompleteList boşaltıldı =>", name);
                    }
                }
            }
        }, [autoCompleteList]);

        useEffect(() => {
            // isDev && console.log('data =>', name, data, 'selectedValue =>', selectedValue, 'value =>', value);
            if (!Array.isArray(data)) {
                setData([]);
            }
            if (data.length > 0) {
                setLoading(false);
                checkByValue(selectedValue, open);
                if (!value && ilkSec) {
                    checkByValue(data[0][valueKey], false);
                }
            } else {
                !isDataFromApi && clear(false);
            }
        }, [data]);

        // Seçim değişikliğinde parent'ı bilgilendir
        useEffect(() => {
            // isDev && console.log('selectedValue =>', name, selectedValue, 'value =>', value);
            if (value?.toString() != selectedValue?.toString()) {
                checkByValue(value, open);
                // isDev && console.log('value Kontrol ediliyor', value, selectedValue);
            }
        }, [value]);

        useEffect(() => {
            if (parentInputValue !== parentValue) {
                setParentValue(parentInputValue);
                clear(false);
                // isDev && console.log(name, "parentInputValueDeğişti =>", parentInputValue);
            }
        }, [parentInputValue]);

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
                setScrollListPosition(refList);
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

        const setValue = useCallback(
            (item: typeList | undefined, openList: boolean) => {
                const newValue = item?.[valueKey] ?? '';
                const newLabel = item?.[labelKey] ?? '';
                setOpen(openList);
                setText(newLabel);

                // isDev && console.log(name, "setValue", newValue, "item", item, "value", value);
                if (newValue === selectedValue) return;
                setFilter('');
                setSelectedValue(newValue);
                onChange && sendChange(newValue);
                onSelect && onSelect(item);
            },
            [onChange, onSelect, name, selectedValue, valueKey, labelKey]
        );

        const textInputOnChange = useCallback(
            (e: any) => {
                setSelectedValue(undefined);
                setText(e.target.value);
                setFilter(e.target.value.trim());
                setOpen(true);
                onText && onText(e.target.value);
            },
            [setValue, onText]
        );

        const checkByValue = useCallback(
            (value: typeValue, openList: boolean = false, list: typeList[] = []) => {
                const targetList = list.length > 0 ? list : data;
                let find = Object.values(targetList).find((item: any) => convertLowerCase(item[valueKey]) === convertLowerCase(value));
                if (!find && newCreate && newItemCreate.create) {
                    find = newItemCreate;
                }
                // isDev && console.log('find', find, 'value', value, data);
                setValue(find, openList);
            },
            [data, valueKey, newCreate, newItemCreate, setValue]
        );
        const checkByInput = useCallback(() => {
            const findByLabel: any = data.find((item: any) => convertLowerCase(item[labelKey]) === convertLowerCase(refInput.current?.value));
            if (findByLabel && value == findByLabel[valueKey]) {
                setOpen(false);
                return;
            }
            setValue(findByLabel, false);
            if (!findByLabel) setText('');

            if (isDataFromApi && !findByLabel && data.length === 0) {
                if (onText) onText('');
            }
        }, [data, labelKey, value, valueKey, isDataFromApi, onText, setValue, refInput.current]);

        const clear = useCallback(
            (openList: boolean = true, focusInput: boolean = false) => {
                setFilter('');
                setText('');
                setValue(undefined, openList);
                onText && onText('');
                focusInput && refInput?.current?.focus();
            },
            [setValue, onText]
        );
        const sendChange = useCallback(
            (value: typeValue) => {
                // isDev && console.log(name, "sendChange", value, "selectedValue", selectedValue);
                if (onChange && value !== selectedValue) {
                    onChange({ target: { name, value } });
                }
            },
            [onChange, name]
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

        const handleUpdatePosition = () => {
            if (open && !listPositionRelative && refMain) {
                setFixedPosition(refMain);
            }
        };

        const onKeyDown = (e: any) => {
            if (!open || !refList.current) return null;
            onKeyboardSelection({
                e,
                targetElement: refList,
                checkByInput,
                checkByValue,
                clear,
                itemClass: 'li.item',
                selectedClass: 'selected'
            });
        };

        return (
            <div ref={refMain} className={styles.searchableInputComponent} onKeyDown={onKeyDown} style={style}>
                <Input
                    {...other}
                    inputRef={refInput}
                    name={name}
                    value={text}
                    onFocus={() => !disabled && setOpen(true)}
                    onChange={textInputOnChange}
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
                                    hidden={!data || !(data.length > 0)}
                                    onClick={() => !disabled && setOpen(!open)}
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
                            {(filteredData.length === 0 || loading) && <div className={`message ${loading ? 'loading' : ''}`}>{loading ? loadingMessage : notFoundMessage}</div>}
                            {filteredData.map((item: any, key: number) => {
                                const itemValue = item[valueKey];
                                const itemLabel = item[labelKey];
                                return (
                                    <li key={key} className={`item ${itemValue === selectedValue ? 'active' : ''}`} data-value={itemValue} data-label={itemLabel} onClick={() => setValue(item, false)}>
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
    }
);

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
