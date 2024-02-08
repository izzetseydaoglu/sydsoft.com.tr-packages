/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 8.02.2024 05:12
 */

import React, {useEffect, useState} from "react";
import {CSS_DataTable} from "./css";
import {TableNoApi_THEAD} from "./thead";
import {TableNoApi_TBODY} from "./tbody";
import {TableNoApi_Pagination} from "./pagination";
import useDeepCompareEffect from "use-deep-compare-effect";
import {filterData, paginateData, sortData} from "./func";
import {PropsInput} from "@sydsoft.com.tr/form";

type columnsType = {
    field: string,
    title: string | React.ReactNode,
    sortable?: boolean,
    filterable?: boolean,
    filterSelect?: { label: any, value: any }[],
    filterSelectAuto?: boolean,
    filter_external?: boolean,
    filter_placeholder?: string,
    hide?: boolean,
    render?: (row: any, sira: number) => void,
    className?: string,
    styleTH?: React.CSSProperties,
    styleTD?: React.CSSProperties,
    inputProps: PropsInput,
}
type filtersType = {
    operator: "=" | "like",
    value: any,
    external?: boolean
};
type settingsType = {
    sortable?: boolean,
    filterable?: boolean,
    pagination?: boolean,
    header?: boolean,
    stickyHeader?: boolean,
    styleTHEAD?: object,
    borderSpacing?: number,
    actionsAutoHide?: boolean,
    actionsPosition?: "start" | "end",
    notFoundMessage?: any,
    styleNotFound?: object,
    orderBy?: string,
    order?: "asc" | "desc",
    page?: number,
    pageSize?: number,
    filters?: filtersType | {},
    filtersShow?: boolean,
}

type settingsFilterType = {
    page: number,
    pageSize: number,
    order: "asc" | "desc",
    orderBy: string,
    filters: filtersType | {},
}

export type apiTableType = {
    rows: any[],
    count: number,
}

type Props = {
    api?: apiTableType | false,
    setApi?: Function,
    columns: columnsType[],
    rows?: any[], //api varsa zorunlu değil
    actions?: Function[],
    filter?: any[],
    settings?: settingsType,
    style?: React.CSSProperties,
    rowOnClick?: Function,
    rowOnClass?: Function,
}


export const DataTable = ({columns, rows = [], actions, settings = {}, api = false, setApi, rowOnClick, rowOnClass, style}: Props) => {
    const [config, setConfig] = useState<settingsType>({
        header: true,
        stickyHeader: true,
        styleTHEAD: {},
        actionsAutoHide: true,
        actionsPosition: "end",
        notFoundMessage: "Herhangi bir kayıt bulunamadı",
        borderSpacing: 1,
        filtersShow: false,
        sortable: true,
        filterable: true,
        pagination: true,
        styleNotFound: {},
    });
    const initialSettings = {
        page: settings?.page || 1,
        pageSize: settings?.pageSize || 50,
        order: settings?.order || "desc",
        orderBy: settings?.orderBy || Object.values(columns)[0]["field"],
        filters: settings?.filters || {},
    };
    const [settingsFilter, setSettingsFilter] = useState<settingsFilterType>(initialSettings);
    const [data, setData] = useState<any>([]);
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        if (api) {
            setData(api.rows);
            setCount(api.count);
        }
    }, [api])

    useEffect(() => {
        if (api && setApi) {
            setApi({
                page: settingsFilter.page,
                pageSize: settingsFilter.pageSize,
                order: settingsFilter.order,
                orderBy: settingsFilter.orderBy,
                filters: settingsFilter.filters,
            });
        } else {
            createDataNoApi();
        }
    }, [settingsFilter]);

    useDeepCompareEffect(() => {
        if (settings) {
            setConfig({...config, ...settings});
            setSettingsFilter(prevState => ({
                ...prevState,
                page: settings?.page || prevState.page,
                pageSize: settings?.pageSize || prevState.pageSize,
                order: settings?.order || prevState.order,
                orderBy: settings?.orderBy || prevState.orderBy,
                filters: (settings?.filters) ? {...prevState.filters, ...settings.filters} : prevState.filters,
            }));
        }
    }, [settings])

    useDeepCompareEffect(() => {
        if (!api) {
            setSettingsFilter(initialSettings)
            createDataNoApi();
        }
    }, [rows, rows?.length])


    const createDataNoApi = () => {
        const filteredRows = filterData(rows, settingsFilter.filters);
        const sortedRows = sortData(filteredRows, settingsFilter.order, settingsFilter.orderBy);
        const data = (config.pagination) ? paginateData(sortedRows, settingsFilter.page, settingsFilter.pageSize) : sortedRows;
        setData(data);
        setCount(Object.keys(filteredRows).length);
    };


    return (
        <CSS_DataTable style={style} $borderSpacing={config.borderSpacing}>
            <div className={"tablebase"}>
                <table>
                    <TableNoApi_THEAD {...{columns, rows, config, setConfig, settingsFilter, setSettingsFilter, actions}}/>
                    <TableNoApi_TBODY {...{columns, data, actions, config, rowOnClick, rowOnClass, settingsFilter}}/>
                </table>
                {(!(count > 0)) && (
                    <div className={"no-data"} style={config.styleNotFound}>{config.notFoundMessage}</div>
                )}
            </div>

            {(config.pagination && count > 0) && (
                <TableNoApi_Pagination
                    activePage={settingsFilter.page}
                    count={count}
                    rowsPerPage={settingsFilter.pageSize}
                    totalPages={Math.ceil(count / settingsFilter.pageSize)}
                    setSettingsFilter={setSettingsFilter}
                />
            )}
        </CSS_DataTable>
    );
};
