/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:13
 */

import React, {memo} from "react";
import {Label} from "./Label";
import useDeepCompareEffect from "use-deep-compare-effect";
import {Col, Row, SpacingValues} from "@sydsoft.com.tr/grid";

type gridValues = "auto" | "full" | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
type grid = {
    xs?: gridValues
    sm?: gridValues
    md?: gridValues
    lg?: gridValues
    xl?: gridValues
};

export type PropsFormOgeler = {
    label?: string | null,
    noRender?: boolean,
    fullComponent?: any,
    component?: any,
    propsComponent?: object,
    propsRow?: object,
    propsLabel?: object,
    gridLabel?: grid,
    gridInput?: grid
};


interface Props {
    // form: { [key: string | number]: any; }[],
    form: any[],
    formOgeler: PropsFormOgeler[],
    onChange: Function,
    sabitGrid: {
        label: grid,
        input: grid
    },
    formType: "label" | "noLabel"
    justifyContent: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly",
    rowSpacing?: SpacingValues,
    colSpacing?: SpacingValues,
}


export const FormOlustur = memo(function FunctionMemo(props: Props) {

    useDeepCompareEffect(() => {
        if (props.formOgeler && props.onChange && props.form) {
            props.formOgeler.forEach((formOgeler: any) => {
                if (formOgeler.noRender && formOgeler?.component?.props?.name && form[formOgeler?.component?.props?.name] != "") {
                    if (formOgeler?.component && formOgeler?.component?.props?.name) onChange({
                        target: {
                            name: formOgeler.component.props.name,
                            value: ""
                        }
                    });
                }
            })

        }
    }, [props.form])


    const {form, formOgeler, onChange, formType, sabitGrid, justifyContent, rowSpacing, colSpacing} = props;

    const result = formOgeler.map(
        (
            {noRender, fullComponent, component, propsComponent, propsRow, label, propsLabel, gridLabel, gridInput}: PropsFormOgeler,
            i: React.Key
        ) => {

            if (noRender) {
                return null;
            }

            if (fullComponent) return React.cloneElement(fullComponent, {key: i});

            let newProps = {...propsComponent};

            if (onChange && component && !component.props.onChange) {
                newProps = {...newProps, onChange};
            }


            if (onChange && form && component.props.name && !component.props.value) {
                newProps = {...newProps, value: (form[component.props.name] && form[component.props.name].length > 0) ? String(form[component.props.name]) : ""};
            }

            if (formType === "label") newProps = {...newProps, label: ""};


            const detectLabel = label || component.props.label;
            gridLabel = {...sabitGrid.label, ...gridLabel};
            gridInput = {...sabitGrid.input, ...gridInput};

            return (
                <Row
                    key={i}
                    justifyContent={justifyContent}
                    rowSpacing={rowSpacing}
                    colSpacing={colSpacing}
                    {...propsRow}
                >
                    {formType === "label" && detectLabel && (
                        <Col {...gridLabel}>
                            <Label required={component.props.required} {...propsLabel}>
                                {detectLabel}
                            </Label>
                        </Col>
                    )}
                    <Col {...gridInput}>
                        {React.cloneElement(component, newProps)}
                    </Col>
                </Row>
            );
        })

    return <React.Fragment>{result}</React.Fragment>

});

