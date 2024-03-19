/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 20.03.2024 01:11
 */
import React from "react";
import {createRoot} from "react-dom/client";
import HTMLReactParser from "html-react-parser";
import {Modal} from "@sydsoft.com.tr/modal";
import {Box, BoxFooter} from "@sydsoft.com.tr/box";
import {Button} from "./Button";


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
    autoFocus?: "accept" | "cancel";

}

export const Dialog = (config: propsDialog) => new Promise((resolve) => {
    if (typeof window === "undefined") return false;
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
        autoFocus: "accept",
        ...config
    }

    const close = () => {
        if (mainDiv) {
            root.unmount();
            mainDiv.remove();
        }
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
                {HTMLReactParser(settings.message)}
            </div>
            {(settings.acceptButtonShow || settings.cancelButtonShow) && (
                <BoxFooter style={settings.styleBoxFooter}>
                    {settings.cancelButtonShow && <Button autoFocus={(settings.autoFocus === "cancel")} buttonClass={settings.cancelButtonClass} onClick={onCancel}>{settings.cancelButtonText}</Button>}
                    {settings.acceptButtonShow && <Button autoFocus={(settings.autoFocus === "accept")} buttonClass={settings.acceptButtonClass} onClick={onAccept}>{settings.acceptButtonText}</Button>}
                </BoxFooter>
            )}
        </Box>
    </Modal>
    root.render(Component);
});