/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */
import React from "react";
import Modal from "./Modal/Modal";
import {Button} from "./Form";
import {htmlParser, isDev} from "@/_slib_reactts/_globalFunctions";
import {createRoot} from "react-dom/client";
import {Box, BoxFooter} from "@sydsoft.com.tr/box";


export type propsDialog = {
    message: any;
    acceptButtonShow?: boolean;
    cancelButtonShow?: boolean;
    acceptButtonText?: string;
    cancelButtonText?: string;
    acceptButtonClass?: | 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
    cancelButtonClass?: | 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'link';
    vertialAlign?: "flex-start" | "center" | "flex-end";
    horizontalAlign?: "flex-start" | "center" | "flex-end";
    hideBackdrop?: boolean;
    hideEsc?: boolean;
    styleMessage?: object;
    styleBox?: object;
    styleBoxFooter?: object;

}

export const sDialog = (config: propsDialog) => new Promise((resolve) => {
    if (typeof window === "undefined") return false;
    isDev && console.log("sDialog");
    let mainDiv: any = document.getElementById("sdialog");
    if (!mainDiv) {
        const createDiv = document.createElement("div");
        createDiv.setAttribute("id", "sdialog");
        document.body.appendChild(createDiv);
        mainDiv = createDiv;
    }
    const root = createRoot(mainDiv!);
    const settings: propsDialog = {
        acceptButtonShow: true,
        cancelButtonShow: true,
        acceptButtonText: "EVET",
        cancelButtonText: "HAYIR",
        acceptButtonClass: "danger",
        cancelButtonClass: "secondary",
        vertialAlign: "center",
        horizontalAlign: "center",
        hideBackdrop: true,
        hideEsc: true,
        styleMessage: {
            fontSize: "1.2rem",
        },
        styleBox: {margin: 0, minWidth: 250},
        styleBoxFooter: {padding: "8px 5px"},
        ...config
    }


    // const checkEnter = (e: any) => {
    //     isDev && console.log(e);
    //     if (e.keyCode === 13 || e.key === "Enter" || e.code === "Enter") onAccept();
    // }
    //
    // window.addEventListener("keydown", checkEnter)

    const close = () => {
        if (mainDiv) {
            // ReactDOM.unmountComponentAtNode(mainDiv);
            root.unmount();
            mainDiv.remove();
        }
        // window.removeEventListener("keydown", checkEnter);
    }

    const onCancel = () => {
        resolve(false);
        close();
    }

    const onAccept = () => {
        resolve(true);
        close();
    }

    const Component = <Modal
        open={true}
        keepMounted={false}
        close={onCancel}
        hideBackdrop={settings.hideBackdrop}
        hideEsc={settings.hideEsc}
        hideCloseButton={true}
        vertialAlign={settings.vertialAlign}
        horizontalAlign={settings.horizontalAlign}
    >
        <Box style={settings.styleBox}>
            <div style={settings.styleMessage}>
                {htmlParser(settings.message)}
            </div>
            {(settings.acceptButtonShow || settings.cancelButtonShow) && (
                <BoxFooter style={settings.styleBoxFooter}>
                    {settings.cancelButtonShow && <Button buttonClass={settings.cancelButtonClass} onClick={onCancel}>{settings.cancelButtonText}</Button>}
                    {settings.acceptButtonShow && <Button autoFocus={true} buttonClass={settings.acceptButtonClass} onClick={onAccept}>{settings.acceptButtonText}</Button>}
                </BoxFooter>
            )}
        </Box>
    </Modal>
    // ReactDOM.render(Component, mainDiv);
    root.render(Component);
});