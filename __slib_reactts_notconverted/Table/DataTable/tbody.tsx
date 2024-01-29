/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";

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
                    <td className={(config.actionsAutoHide) ? "actions hide" : "actions"} onClick={(e) => e.stopPropagation()}>
                        <div>
                            {(actions).map((action: any, key: number) => {
                                return React.cloneElement(action(row), {key});
                            })}
                        </div>
                    </td>
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
                    <td className={(config.actionsAutoHide) ? "actions hide" : "actions"} onClick={(e) => e.stopPropagation()}>
                        <div>
                            {(actions).map((action: any, key: number) => {
                                return React.cloneElement(action(row), {key});
                            })}
                        </div>
                    </td>
                }
            </tr>
        })}
        </tbody>
    );
};