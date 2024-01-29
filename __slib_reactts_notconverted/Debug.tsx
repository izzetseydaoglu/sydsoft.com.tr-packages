/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React from "react";
import {Button} from "./Form";
import Icon from "./Icon/Icon";
import {JSONTree} from 'react-json-tree';
import {isDev} from "@/_slib_reactts/_globalFunctions";
import {createRoot} from "react-dom/client";

let sDebugList: any[] = [];
let rootDebug: any = null;
export const setDebug = (log: any) => {
    if (typeof window === undefined) return null;
    sDebugList.push(log);
    let debugDiv = document.getElementById("sdebug");
    if (!debugDiv) {
        debugDiv = document.createElement('div');
        debugDiv.setAttribute("id", "sdebug");
        debugDiv.setAttribute("style", `
                position: fixed;
                bottom: 0px;
                right: 0px;
                width: 55px;
                height: 55px;
                background: #2191c994;
                z-index: 11111;
                display: flex;
                align-items: center;
                justify-content: center;
                
            `);
        document.body.appendChild(debugDiv);
    }

    const theme = {
        scheme: 'monokai',
        author: 'wimer hazenberg (http://www.monokai.nl)',
        base00: '#272822',
        base01: '#383830',
        base02: '#49483e',
        base03: '#75715e',
        base04: '#a59f85',
        base05: '#f8f8f2',
        base06: '#f5f4f1',
        base07: '#f9f8f5',
        base08: '#f92672',
        base09: '#fd971f',
        base0A: '#f4bf75',
        base0B: '#a6e22e',
        base0C: '#a1efe4',
        base0D: '#66d9ef',
        base0E: '#ae81ff',
        base0F: '#cc6633',
    };

    const Component = <>
        <Button onClick={degugShow} onlyIcon={<Icon iconMui={"local_police"}/>}/>
        <div id={"sdebug_log"} data-status={"close"} style={{display: "none"}}>
            <JSONTree data={sDebugList}
                      theme={theme}
                      hideRoot={true}
                      invertTheme={true}
                      labelRenderer={([key]) => <strong>{key}</strong>}
            />
        </div>

    </>
    if (!rootDebug) rootDebug = createRoot(debugDiv!);
    rootDebug.render(Component);
    // ReactDOM.render(Component, debugDiv);
}

const degugShow = () => {
    const sdebug_log = document.getElementById("sdebug_log");
    if (sdebug_log) {
        const status = sdebug_log.dataset.status;
        if (status === "close") {
            sdebug_log.setAttribute("style", `             
                    position: fixed;
                    top: 5%;
                    left: 5%;
                    width: 90%;
                    height: 90%;
                    z-index: 11111;
                    display: block;
                    padding: 20px;
                    background: #fff;
                    border: 1px #c5c0c0 solid;
                    overflow:scroll;
                `);
            sdebug_log.dataset.status = "open";
        } else {
            sdebug_log.setAttribute("style", `             
                    display:none;
                `);
            sdebug_log.dataset.status = "close";
        }
    }
}

export function debugCheck(response: any) {
    if (isDev) {
        if (response.data) {
            setDebug(response.data)
        } else {
            setDebug(response)
        }
    }
}