/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 12.02.2024 01:15
 */

import React from "react";
import {ActionsTD} from "./actionsTD";

export const TableNoApi_TBODY = ({columns, data, actions, config, rowOnClick, rowOnClass, settingsFilter}: any) => {
    const onClick = (e: any, row: any) => (rowOnClick) ? rowOnClick(row, e) : null

    function checkClassNames(row: any) {
        let className: string = "";
        if (rowOnClass) className = rowOnClass(row);
        if (actions) className += " hasaction";
        return className;
    }

    return (
        <tbody>
        {Object.values(data).map((row: any, keyRow: number) => {
            return <tr key={keyRow}
                       onClick={(e: any) => onClick(e, row)}
                       data-onclick={!!(rowOnClick)}
                // className={(actions) ? "hasaction" : ""}
                       className={checkClassNames(row)}
            >
                {(actions && config.actionsPosition == "start") &&
                    <ActionsTD actions={actions} row={row} config={config}/>
                }
                {Object.values(columns).map((column: any, key: number) => {
                    if (column.hide) return null;
                    const value = (column.render) && column.render(row, ((keyRow + 1) + ((settingsFilter.page - 1) * settingsFilter.pageSize))) || row[column.field];
                    return <td key={key}>
                        {(typeof value === "string") && (
                            <div className={"value"} title={value} style={(column.styleTD) ? column.styleTD : null}>
                                {value}
                            </div>
                        ) || (
                            <div className={"value"} style={(column.styleTD) ? {...column.styleTD, padding: 0} : null}>
                                {value}
                            </div>
                        )}
                    </td>
                })}
                {(actions && config.actionsPosition == "end") &&
                    <ActionsTD actions={actions} row={row} config={config}/>
                }
            </tr>
        })}
        </tbody>
    );
};

