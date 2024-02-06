/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */
import React from "react";
import {Menu} from "@sydsoft.com.tr/menu";
import {Popover} from "@sydsoft.com.tr/popover";
import {Button} from "@sydsoft.com.tr/form";
import {Icon} from "@sydsoft.com.tr/icon";


export const TableNoApi_Pagination = ({activePage, count, rowsPerPage, totalPages, setSettingsFilter}: any) => {

    const setActivePage = (page: number) => setSettingsFilter((settingsFilter: any) => ({...settingsFilter, page: page}))
    const setPageSize = (pageSize: number) => setSettingsFilter((settingsFilter: any) => ({...settingsFilter, page: 1, pageSize: pageSize}))

    const PagesList = () => {
        const pages = []
        for (let i = 1; i <= totalPages; i++) {
            pages.push({
                title: i,
                onClick: () => setActivePage(i),
                style: {
                    padding: "5px 30px",
                    background: (i === activePage) ? "rgba(0,0,0,0.1)" : "",
                },
            })
        }
        return <Menu menu={pages} withIcon={false}/>
    }

    const RowsPerPageList = () => {
        const pages: any[] = []
        {
            [5, 10, 15, 20, 30, 50, 100, 500, 1000].map((i) => {
                pages.push({
                    title: i,
                    onClick: () => setPageSize(i),
                    style: {
                        padding: "5px 30px",
                        background: (i === rowsPerPage) ? "rgba(0,0,0,0.1)" : "",
                    },
                })
            })
        }
        return <Menu menu={pages} withIcon={false}/>
    }
    return (
        <div className="pagination">
            <div className={"bilgi"}>Toplam Kayıt: <span>{count}</span></div>
            <div className={"bilgi"}>Sayfa: <span>{activePage} / {totalPages}</span></div>


            <Popover component={<Button className={"sayfala"} buttonClass={"link"}>Sayfala: <span>{rowsPerPage}</span></Button>} removeWhenClickInside={true}>
                <RowsPerPageList/>
            </Popover>

            <Button buttonClass={"link"} disabled={activePage === 1} onClick={() => setActivePage(1)} onlyIcon={<Icon iconMui={"first_page"}/>}/>
            <Button buttonClass={"link"} disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)} onlyIcon={<Icon iconMui={"chevron_left"}/>}/>
            <Popover component={<Button buttonClass={"link"}>{activePage}</Button>} removeWhenClickInside={true}>
                <PagesList/>
            </Popover>
            <Button buttonClass={"link"} disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)} onlyIcon={<Icon iconMui={"chevron_right"}/>}/>
            <Button buttonClass={"link"} disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)} onlyIcon={<Icon iconMui={"last_page"}/>}/>
        </div>
    )
}