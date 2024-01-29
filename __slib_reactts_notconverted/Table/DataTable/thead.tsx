/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 21:51
 */

import Icon from "../../../_components/icon/component/Icon";
import React, {useState} from "react";
import {Input} from "../../Form";
import Tooltip from "../../../_components/tooltip/component/Tooltip";

export const TableNoApi_THEAD = ({columns, rows, config, setConfig, settingsFilter, setSettingsFilter, actions}: any) => {
    if (!config.header) return null;
    const [focusFilter, setFocusFilter] = useState<boolean>(false);

    const handleSort = (field: string) => {
        setSettingsFilter((prev: any) => ({
            ...prev,
            page: 1,
            order: prev.order === 'asc' && prev.orderBy === field ? 'desc' : 'asc',
            orderBy: field,
        }))
    }

    const toogleFilters = () => {
        setConfig((prev: any) => ({
            ...prev,
            filtersShow: !prev.filtersShow
        }));

        if ((Object.keys(settingsFilter.filters).length) > 0) {
            setSettingsFilter((prev: any) => ({
                ...prev,
                filters: {},
                page: 1
            }))
        }
    }

    const handleSearch = (value: any, field: string) => {
        const findColumn: any = Object.values(columns).find((column: any) => column.field === field)
        if (findColumn) {
            if (value) {
                setSettingsFilter((prev: any) => ({
                    ...prev,
                    filters: {
                        ...prev.filters,
                        [field]: {
                            operator: (findColumn.filterSelect || findColumn.filterSelectAuto) ? '=' : 'like',
                            value: value,
                            external: !!(findColumn?.filter_external)
                        }
                    },
                    page: 1
                }))
            } else {
                setSettingsFilter((prev: any) => {
                    const updatedFilters = {
                        ...prev,
                        page: 1
                    }
                    delete updatedFilters.filters[field]
                    return updatedFilters
                })
            }
        }
    }


    return (
        <thead className={(config.stickyHeader) ? "sticky" : ""} style={(config.styleTHEAD) ? config.styleTHEAD : null}>
        <tr>
            {(actions && config.actionsPosition == "start") && <th className={(config.actionsAutoHide) ? "actions hide" : "actions"}/>}
            {Object.values(columns).map((column: any, key: number) => {
                if (column.hide) return null;
                const sortable = config.sortable !== false && column.sortable !== false;
                return <th key={key}
                           data-sortable={(sortable) ? "true" : "false"}
                           className={column?.className}
                           style={(column.styleTH) ? column.styleTH : null}
                >
                    <div className={"title"}
                         onClick={() => { if (sortable) handleSort(column.field)}}
                         style={{justifyContent: (config.filtersShow) ? "center" : "flex-start"}}
                    >
                        {column.title}
                        {(sortable && settingsFilter.orderBy === column.field) && (
                            <Icon className={"ordericon"}
                                  iconMui={(settingsFilter.order === "desc") ? "arrow_drop_up" : "arrow_drop_down"}
                            />
                        )}
                    </div>
                    {(config.filterable) && (
                        <Tooltip title={(Object.keys(settingsFilter.filters).length > 0 || config.filtersShow) ? "Filtreleri temizle" : "Filtrele"}>
                            <Icon className={"filtericon"}
                                  iconMui={(Object.keys(settingsFilter.filters).length > 0 || config.filtersShow) ? "close" : "search"}
                                  onClick={toogleFilters}/>
                        </Tooltip>
                    )}
                </th>
            })}
            {(actions && config.actionsPosition == "end") && <th className={(config.actionsAutoHide) ? "actions hide" : "actions"}/>}
        </tr>
        <tr className={(Object.keys(settingsFilter.filters).length > 0 || config.filtersShow || focusFilter) ? "filters_open" : ""}>
            {(actions && config.actionsPosition == "start") && <th className={(config.actionsAutoHide) ? "actions hide" : "actions"}/>}
            {Object.values(columns).map((column: any, key: number) => {
                if (column.hide) return null;
                let selectList = column.filterSelect || [];
                if (column.filterSelectAuto) {
                    Object.values(rows).filter((item: any) => {
                        if (!Object.values(selectList).find((list: any) => list.value === item[column.field])) {
                            selectList.push({value: item[column.field]})
                        }
                    })
                }
                if (column.filterable === false) return <th key={key}/>;
                return <th key={key}>
                    <div className={"filter"}>
                        {(column.filterSelect || column.filterSelectAuto) && (
                            <Input
                                disabled={(column.filterable === false)}
                                className={"filter-input"}
                                placeholder={(column?.filter_placeholder) ? column.filter_placeholder : column.title}
                                value={settingsFilter.filters[column.field]?.value || ""}
                                select={selectList}
                                onChange={(e: any) => handleSearch(e.target.value, column.field)}
                                onFocus={() => setFocusFilter(true)}
                                onBlur={() => setFocusFilter(false)}
                            />
                        ) || (
                            <Input
                                disabled={(column.filterable === false)}
                                className={"filter-input"}
                                placeholder={(column?.filter_placeholder) ? column.filter_placeholder : column.title}
                                value={settingsFilter.filters[column.field]?.value || ""}
                                onChange={(e: any) => handleSearch(e.target.value, column.field)}
                                onFocus={() => setFocusFilter(true)}
                                onBlur={() => setFocusFilter(false)}
                            />
                        )}
                    </div>
                </th>
            })}
            {(actions && config.actionsPosition == "end") && <th className={(config.actionsAutoHide) ? "actions hide" : "actions"}/>}
        </tr>
        </thead>
    );
};