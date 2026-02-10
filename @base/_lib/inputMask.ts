/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import { isDev } from "./baseFunctions";

// Mask işleme core fonksiyonları
const createMaskCore = () => {
    const defaultTranslation: any = {
        "0": { pattern: /\d/ },
        "9": { pattern: /\d/, optional: true },
        "#": { pattern: /\d/, recursive: true },
        A: { pattern: /[a-zA-Z0-9]/ },
        S: { pattern: /[a-zA-Z]/ },
        U: { pattern: /[a-zA-Z]/, transform: (char: any) => char.toUpperCase() },
        L: { pattern: /[a-zA-Z]/, transform: (char: any) => char.toLowerCase() },
        X: { pattern: /[0-9a-fA-F]/ }
    };

    const parseMask = (maskString: string, translation = defaultTranslation) => {
        const tokens = [];
        let i = 0;

        while (i < maskString.length) {
            const char = maskString[i];

            if (translation[char]) {
                tokens.push({
                    type: "input",
                    pattern: translation[char].pattern,
                    optional: translation[char].optional,
                    recursive: translation[char].recursive,
                    transform: translation[char].transform
                });
            } else {
                tokens.push({
                    type: "literal",
                    char: char
                });
            }
            i++;
        }

        return tokens;
    };

    const applyMask = (inputValue: string, maskTokens: any, reverse = false) => {
        if (!maskTokens.length) return inputValue;

        const normalizedValue = inputValue == null ? "" : String(inputValue);
        const cleanValue = normalizedValue.replace(/[^\w\s]/g, "");

        if (reverse) {
            return applyReverseMask(cleanValue, maskTokens);
        }

        let result = "";
        let valueIndex = 0;
        let maskIndex = 0;

        while (maskIndex < maskTokens.length && valueIndex < cleanValue.length) {
            const token = maskTokens[maskIndex];

            if (token.type === "literal") {
                result += token.char;
                maskIndex++;
            } else {
                const char = cleanValue[valueIndex];

                if (token.pattern.test(char)) {
                    const transformedChar = token.transform ? token.transform(char) : char;
                    result += transformedChar;
                    valueIndex++;
                    maskIndex++;
                } else if (token.optional) {
                    maskIndex++;
                } else {
                    valueIndex++;
                }
            }
        }

        while (maskIndex < maskTokens.length) {
            const token = maskTokens[maskIndex];
            if (token.type === "literal") {
                result += token.char;
            } else if (!token.optional) {
                break;
            }
            maskIndex++;
        }

        return result;
    };

    const applyReverseMask = (inputValue: string, maskTokens: any) => {
        const reversedMask = maskTokens.slice().reverse();
        const reversedValue = inputValue.split("").reverse().join("");
        let result = "";
        let valueIndex = 0;
        let maskIndex = 0;

        while (maskIndex < reversedMask.length && valueIndex < reversedValue.length) {
            const token = reversedMask[maskIndex];

            if (token.type === "literal") {
                result = token.char + result;
                maskIndex++;
            } else {
                const char = reversedValue[valueIndex];

                if (token.pattern.test(char)) {
                    const transformedChar = token.transform ? token.transform(char) : char;
                    result = transformedChar + result;
                    valueIndex++;
                    maskIndex++;
                } else if (token.optional) {
                    maskIndex++;
                } else {
                    valueIndex++;
                }
            }
        }

        return result;
    };

    const getCleanValue = (maskedValue: string, maskTokens: any) => {
        if (!maskTokens.length) return maskedValue;

        let clean = "";
        let valueIndex = 0;
        let maskIndex = 0;

        while (maskIndex < maskTokens.length && valueIndex < maskedValue.length) {
            const token = maskTokens[maskIndex];

            if (token.type === "literal") {
                if (maskedValue[valueIndex] === token.char) {
                    valueIndex++;
                }
                maskIndex++;
            } else {
                clean += maskedValue[valueIndex];
                valueIndex++;
                maskIndex++;
            }
        }

        return clean;
    };

    return {
        parseMask,
        applyMask,
        getCleanValue
    };
};

// Fonksiyonel yaklaşım - herhangi bir input elementine mask uygula
export const applyInputMask = (inputElement: any, mask: string, options: any = {}) => {
    if (!inputElement || !mask) return null;

    isDev && console.log("Input mask applied:", { inputElement, mask, options });

    const { translation, reverse = false, clearIfNotMatch = true, selectOnFocus = false, onChange } = options;

    const maskCore = createMaskCore();
    const maskTokens = maskCore.parseMask(mask, translation);

    const applyMaskToValue = (inputValue: any) => maskCore.applyMask(inputValue, maskTokens, reverse);

    const getCleanValue = (maskedValue: any) => maskCore.getCleanValue(maskedValue, maskTokens);

    const handleInputChange = (e: any) => {
        const inputValue = e.target.value;
        const maskedValue = applyMaskToValue(inputValue);
        const cleanValue = getCleanValue(maskedValue);

        e.target.value = maskedValue;
        onChange?.(maskedValue, cleanValue, e);
    };

    const handleKeyDown = (e: any) => {
        const { key, target } = e;
        const cursorStart = target.selectionStart;
        const cursorEnd = target.selectionEnd;

        if (key === "Backspace" || key === "Delete") {
            e.preventDefault();

            let newValue = target.value;

            if (cursorStart !== cursorEnd) {
                newValue = newValue.substring(0, cursorStart) + newValue.substring(cursorEnd);
            } else if (key === "Backspace" && cursorStart > 0) {
                newValue = newValue.substring(0, cursorStart - 1) + newValue.substring(cursorStart);
            } else if (key === "Delete" && cursorStart < newValue.length) {
                newValue = newValue.substring(0, cursorStart) + newValue.substring(cursorStart + 1);
            }

            const maskedValue = applyMaskToValue(newValue);
            target.value = maskedValue;

            const cleanValue = getCleanValue(maskedValue);
            onChange?.(maskedValue, cleanValue, e);

            setTimeout(() => {
                const newPos = key === "Backspace" ? Math.max(0, cursorStart - 1) : cursorStart;
                target.setSelectionRange(newPos, newPos);
            }, 0);
        }
    };

    const handleFocus = (e: any) => {
        if (selectOnFocus) {
            setTimeout(() => {
                e.target.select();
            }, 0);
        }
    };

    const handleBlur = (e: any) => {
        if (clearIfNotMatch) {
            const cleanValue = getCleanValue(e.target.value);
            const expectedLength = maskTokens.filter((t) => t.type === "input" && !t.optional).length;

            if (cleanValue.length < expectedLength) {
                e.target.value = "";
                onChange?.("", "", e);
            }
        }
    };

    // Event listener'ları ekle
    inputElement.addEventListener("input", handleInputChange);
    inputElement.addEventListener("keydown", handleKeyDown);
    inputElement.addEventListener("focus", handleFocus);
    inputElement.addEventListener("blur", handleBlur);

    // Cleanup fonksiyonu
    const destroy = () => {
        inputElement.removeEventListener("input", handleInputChange);
        inputElement.removeEventListener("keydown", handleKeyDown);
        inputElement.removeEventListener("focus", handleFocus);
        inputElement.removeEventListener("blur", handleBlur);
    };

    // Utility fonksiyonları
    return {
        destroy,
        setValue: (value: any) => {
            if (!value) return;
            const maskedValue = applyMaskToValue(value || "");
            inputElement.value = maskedValue;
        },
        getValue: () => inputElement.value,
        getCleanValue: () => getCleanValue(inputElement.value),
        applyMask: applyMaskToValue
    };
};
