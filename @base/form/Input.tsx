import React, { useCallback, useEffect, useRef, useState } from "react";
import { seoCevirFunction, tumuBuyukCevir, tumuKucukCevir } from "../_lib/baseFunctions";

import { Dialog } from "./Dialog";
import { alert_add } from "../alert";
import { applyInputMask } from "../_lib/inputMask";
import styles from "./styles/Input.module.css";

type maskSettingsTranslation = {
    [key: string]: {
        pattern: any;
        transform?: (value: string) => string;
        optional?: boolean;
        recursive?: boolean;
    };
};

type maskSettings = {
    clearIfNotMatch?: boolean;
    reverse?: boolean;
    translation?: maskSettingsTranslation;
    selectOnFocus?: boolean;
    onChange?: (maskedValue: string, cleanValue: string, targetInput: React.ChangeEvent<HTMLInputElement>) => void;
};

export interface PropsInput {
    componentRef?: any;
    inputRef?: any;
    className?: string;
    id?: string;
    name?: string;
    value?: any;
    label?: string;
    loading?: boolean;
    autoFocus?: boolean | undefined;
    disabled?: boolean;
    required?: boolean;
    placeholder?: string;
    type?: 'text' | 'number' | 'email' | 'color' | 'date' | 'time' | 'datetime-local' | 'hidden' | 'file' | 'password' | 'tel' | 'search';

    // - Select
    select?: any[];
    ilkSec?: boolean;
    valueKey?: string;
    labelKey?: string;

    // - Textarea
    multiline?: boolean;
    rows?: number | undefined;

    //--Fonk Props
    onChange?: Function;
    onFocus?: Function;
    onBlur?: Function;
    onClick?: Function;
    onKeyPress?: Function;
    onKeyUp?: Function;
    onKeyDown?: Function;

    //--Ozel Props
    propsComponent?: object | any;
    propsInput?: object;
    startAdornment?: any;
    endAdornment?: any;

    //--Ozel Fonksiyonlar
    sadeceYazi?: boolean;
    sadeceSayi?: boolean;
    tumuBuyuk?: boolean;
    tumuKucuk?: boolean;
    seoCevir?: boolean;
    dosyaNoGiris?: boolean;
    fileNameGiris?: boolean;
    dateGecmisKontrol?: boolean;
    autoSelectText?: boolean;

    //--Mask
    mask?: string;
    maskSettings?: maskSettings;
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
    valueKey = 'value',
    labelKey = 'label',
    ilkSec,
    multiline,
    rows,
    sadeceYazi,
    sadeceSayi,
    tumuBuyuk,
    tumuKucuk,
    seoCevir,
    dosyaNoGiris,
    fileNameGiris,
    dateGecmisKontrol,
    autoSelectText,
    mask = '',
    maskSettings = {
        clearIfNotMatch: true,
        reverse: false, //Tersten doldurmaya başla, fiyatlar için geçerli
        selectOnFocus: false
    }
}) => {
    const refMain = useRef<any>(null);
    const refInput = useRef<any>(null);
    const refLabel = useRef<any>(null);

    const [inputFilled, setInputFilled] = useState(value && value.toString().length > 0);
    const [focus, setFocus] = useState(false);

    useEffect(() => {
        if (inputRef) inputRef.current = refInput.current;
        if (componentRef) componentRef.current = refMain.current;
    }, [componentRef, inputRef]);

    useEffect(() => {
        if (autoSelectText && !select && refInput?.current) {
            refInput.current.select();
        }
    }, [autoSelectText, select]);

    useEffect(() => {
        const filled = value && String(value) && value.toString().length > 0;
        setInputFilled(filled);
        if (filled) {
            refMain?.current?.classList?.remove(styles.error);
        }
    }, [value]);

    useEffect(() => {
        // if (type === "number") sadeceSayi = true; //TODO: sadeceSayi burada değiştirelemez ki!!!
        if (select && ilkSec && value.toString().length === 0) {
            if (select.length) {
                const ilkItem = select[0][valueKey] ? select[0][valueKey] : '';
                onChange && onChange({ target: { name, value: ilkItem } });
            }
        }
    }, [select]);

    useEffect(() => {
        if (typeof window !== 'undefined' && mask?.length > 0 && refInput?.current) {
            refInput.current?.setAttribute('autocomplete', 'off');
        }
        if (mask?.length > 0 && refInput?.current) {
            const maskInstance = applyInputMask(refInput.current, mask, {
                ...maskSettings,
                onChange: (masked: string, clean: string, e: any) => {
                    if (onChange) {
                        onChange({ target: { name, value: masked } });
                    }
                    if (maskSettings && maskSettings.onChange) {
                        maskSettings.onChange(masked, clean, e);
                    }
                }
            });
            maskInstance?.setValue(value ? value : null);
            return () => maskInstance?.destroy();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mask]);

    const Change = useCallback(
        (e: any) => {
            if (tumuBuyuk) tumuBuyukCevir(e);
            if (tumuKucuk) tumuKucukCevir(e);
            if (seoCevir) seoCevirFunction(e);
            setInputFilled(e.target.value.length > 0);
            onChange ? onChange(e) : null;
        },
        [onChange, seoCevir, tumuBuyuk, tumuKucuk]
    );

    const Focus = useCallback(
        (e: any) => {
            onFocus ? onFocus(e) : null;
            setFocus(true);
            refMain?.current?.classList?.remove(styles.error);
        },
        [onFocus]
    );

    const Blur = useCallback(
        (e: any) => {
            if (fileNameGiris && e.target.value !== '' && /[/\\?%*:|"'<>]/g.test(e.target.value)) {
                e.target.value = e.target.value.replace(/[/\\?%*:|"'<>]/g, '-');
                if (onChange) onChange(e);
                alert_add({ type: 'warning', message: 'Lütfen dosya adındaki özel karakter değiştirildi.' });
            }
            if (dosyaNoGiris && e.target.value !== '' && !/^[1-2]\d{3}\/\d/.test(e.target.value)) {
                e.target.value = '';
                if (onChange) onChange(e);
                alert_add({ type: 'error', message: 'Lütfen doğru bir dosya numarası giriniz. Örn: 2022/123' });
            }

            if (dateGecmisKontrol && e.target.value !== '') {
                const today = new Date().toISOString().slice(0, 10);
                if (e.target.value < today) {
                    Dialog({
                        message: 'Geçmiş bir tarihi seçtiniz. Devam etmek istiyor musunuz?'
                    }).then((r) => {
                        if (!r) {
                            e.target.value = '';
                            if (onChange) onChange(e);
                            e.target.focus();
                        }
                    });
                }
            }

            if (required) {
                if (e.target.value === '') {
                    refMain?.current?.classList?.add(styles.error);
                } else {
                    refMain?.current?.classList?.remove(styles.error);
                }
            }

            if (value !== e.target.value) {
                onChange && onChange({ target: { name, value: e.target.value } });
            }

            onBlur ? onBlur(e) : null;
            setFocus(false);
        },
        [fileNameGiris, dosyaNoGiris, dateGecmisKontrol, required, value, onBlur, onChange, name]
    );

    const Click = useCallback((e: any) => (onClick ? onClick(e) : null), [onClick]);

    const KeyPress = useCallback(
        (e: any) => {
            if (sadeceYazi) {
                const turkishLetters = /[ğüşıöçĞÜŞİÖÇ]/;
                if (!(/[A-Za-z\s.]/.test(e.key) || turkishLetters.test(e.key))) {
                    e.preventDefault();
                    return;
                }
            }
            if ((sadeceSayi || dosyaNoGiris) && (e.which < 48 || e.which > 57)) e.preventDefault();
            if (dosyaNoGiris && e.which !== 8 && e.target.value.length === 4 && e.target.value.search('/') === -1) {
                e.target.value = e.target.value + '/';
            }
            onKeyPress ? onKeyPress(e) : null;
        },
        [sadeceYazi, sadeceSayi, dosyaNoGiris, onKeyPress]
    );

    const KeyUp = useCallback((e: any) => (onKeyUp ? onKeyUp(e) : null), [onKeyUp]);

    const KeyDown = useCallback(
        (e: any) => {
            onKeyDown ? onKeyDown(e) : null;
        },
        [onKeyDown]
    );

    const ortakProps = {
        ref: refInput,
        id,
        name,
        value,
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
    };

    let component;
    if (select) {
        component = (
            <select className={`${styles.input} ${styles.select}`} {...ortakProps} {...propsInput}>
                {ilkSec === false && <option value={''} />}
                {select.map((item: any) => {
                    const value = item[valueKey];
                    const label = item[labelKey];
                    return (
                        <option key={value} value={value}>
                            {label ? label : value}
                        </option>
                    );
                })}
            </select>
        );
    } else if (multiline) {
        component = <textarea className={`${styles.input} ${styles.textarea}`} rows={rows} {...ortakProps} {...propsInput} />;
    } else {
        component = <input className={`${styles.input}`} type={type} {...ortakProps} {...propsInput} />;
    }

    const classList = useCallback(() => {
        const list = ['sInputComponent', styles.component];
        if (className) list.push(className);
        if (label) {
            list.push(styles.hidePlaceHolder);
        }
        // if (props.required && (value.length === 0 || !value)) list.push("error");
        return list.join(' ');
    }, [value, className]);

    useEffect(() => {
        if (propsComponent && propsComponent.hasOwnProperty('style')) {
            const background = propsComponent.style.background ? propsComponent.style.background : propsComponent.style.backgroundColor ? propsComponent.style.backgroundColor : null;
            if (background && refLabel.current) {
                refLabel.current.style.setProperty('--label-bg', background);
            }
        }
    }, [propsComponent]);

    return (
        <div ref={refMain} className={classList()} data-disabled={disabled} {...propsComponent}>
            {startAdornment && <div className={`adornment_start ${styles.adornment} ${styles.start}`}>{startAdornment}</div>}

            <div className={`${styles.inputBase} ${inputFilled || focus || type == 'date' ? styles.open : ''}`}>
                {component}
                {label && (
                    <div ref={refLabel} className={`label ${styles.label}`}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </div>
                )}
            </div>

            {(endAdornment || loading) && (
                <div className={`adornment_end ${styles.adornment} ${styles.end}`}>
                    {endAdornment}
                    {loading && <div className={styles.loading} />}
                </div>
            )}
        </div>
    );
};

Input.defaultProps = {
    value: '',
    disabled: false,
    required: false,
    ilkSec: false,
    multiline: false,
    rows: 2,
    loading: false,
    autoFocus: false
};
