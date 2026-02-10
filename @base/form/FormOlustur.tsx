/**
 * @author    : izzetseydaoglu
 * @copyright : sydSOFT Bilişim Hizmetleri (c) 2026
 * @version   : 2026-02-10 20:23:07
 */

import React, { memo, useEffect, useMemo } from 'react';
import { Col, Row, typeJustifyContent, typeSpacingValues } from '../grid';

import { isDev } from '../_lib/baseFunctions';
import { Label } from './Label';

type gridValues = 'auto' | 'full' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type grid = {
    xs?: gridValues;
    sm?: gridValues;
    md?: gridValues;
    lg?: gridValues;
    xl?: gridValues;
    xxl?: gridValues;
};

export type PropsFormOgeler = {
    label?: string | null;
    noRender?: boolean;
    fullComponent?: any;
    component?: any;
    propsComponent?: object;
    propsRow?: object;
    propsLabel?: object;
    gridLabel?: grid;
    gridInput?: grid;
};

interface Props {
    // form: { [key: string | number]: any; }[],
    // form: any[],
    form: { [key: string | number]: any };
    formOgeler: PropsFormOgeler[];
    onChange: Function;
    sabitGrid: {
        label: grid;
        input: grid;
    };
    formType: 'label' | 'noLabel';
    justifyContent: typeJustifyContent;
    rowSpacing?: typeSpacingValues;
    colSpacing?: typeSpacingValues;
}

export const FormOlustur = memo(function FunctionMemo(props: Props) {
    const { form, formOgeler, onChange, formType, sabitGrid, justifyContent, rowSpacing, colSpacing } = props;
    useEffect(() => {
        if (formOgeler && onChange && form) {
            formOgeler.forEach((formOgeler: any) => {
                const fieldName = formOgeler?.component?.props?.name;
                if (formOgeler.noRender && fieldName && form[fieldName] && form[fieldName] != '') {
                    isDev && console.log('noRenderGuncelle');
                    if (formOgeler?.component && formOgeler?.component?.props?.name) {
                        onChange({
                            target: {
                                name: fieldName,
                                value: ''
                            }
                        });
                    }
                }
            });
        }
    }, [JSON.stringify(form), formOgeler]);

    const result = useMemo(() => {
        return formOgeler.map(({ noRender, fullComponent, component, propsComponent, propsRow, label, propsLabel, gridLabel, gridInput }: PropsFormOgeler, i: React.Key) => {
            if (noRender) {
                return null;
            }

            if (fullComponent) return React.cloneElement(fullComponent, { key: i });

            let newProps = { ...propsComponent };

            if (onChange && component && !component.props.onChange) {
                newProps = { ...newProps, onChange };
            }

            if (onChange && form && component.props.name && !component.props.value) {
                newProps = { ...newProps, value: form[component.props.name] && form[component.props.name].length > 0 ? String(form[component.props.name]) : '' };
            }

            if (formType === 'label') newProps = { ...newProps, label: '' };

            const detectLabel = label || component.props.label;
            gridLabel = { ...sabitGrid.label, ...gridLabel };
            gridInput = { ...sabitGrid.input, ...gridInput };

            return (
                <Row key={i} justifyContent={justifyContent} rowSpacing={rowSpacing} colSpacing={colSpacing} {...propsRow}>
                    {formType === 'label' && detectLabel && (
                        <Col {...gridLabel}>
                            <Label required={component.props.required} {...propsLabel}>
                                {detectLabel}
                            </Label>
                        </Col>
                    )}
                    <Col {...gridInput}>{React.cloneElement(component, newProps)}</Col>
                </Row>
            );
        });
    }, [form, formOgeler, onChange, formType, sabitGrid, justifyContent, rowSpacing, colSpacing]);
    return <React.Fragment>{result}</React.Fragment>;
});
