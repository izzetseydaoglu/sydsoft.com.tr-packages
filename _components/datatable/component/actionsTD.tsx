/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 12.02.2024 01:15
 */

import React from "react";
import {Icon} from "@sydsoft.com.tr/icon";
import {Popover} from "@sydsoft.com.tr/popover";
import {Button} from "@sydsoft.com.tr/form";
import {Menu} from "@sydsoft.com.tr/menu";

export const ActionsTD = ({actions, row, config}: any) => {

    const CreateRowMenu = () => {
        return (
            (actions).map((action: any, key: number) => {
                if (action(row).hide) return;
                if (!(action(row).fullComponent)) return;
                return React.cloneElement(action(row).fullComponent, {key});
            })
        )
    }
    const CreateListMenu = () => {
        const list: any[] = [];
        Object.values(actions).map((action: any) => {
            if (action(row).hide || !(action(row).fullComponent)) {
                list.push({
                    icon: action(row).icon,
                    title: action(row).title,
                    onClick: action(row).onClick,
                    dialog: action(row).dialog,
                    seperator: action(row).seperator,
                    style: action(row).style,
                    href: action(row).href
                })
            }
        });
        if (list.length === 0) return null;
        return (
            <Popover
                Component={<Button onlyIcon={<Icon iconMui={"list"} style={{color: "#1282d7"}}/>} title={"Menu"}/>}
                removeWhenClickInside={true}
                position={"bottom"}
            >
                <Menu menu={list} withIcon={true}/>
            </Popover>
        )
    }
    return (
        <td className={(config.actionsAutoHide) ? "actions hide" : "actions"} onClick={(e) => e.stopPropagation()}>
            <div style={{
                left: (config.actionsPosition == "end") ? "unset" : 2,
                right: (config.actionsPosition == "end") ? 2 : "unset",
            }}>
                <CreateRowMenu/>
                <CreateListMenu/>
            </div>
        </td>
    );
}