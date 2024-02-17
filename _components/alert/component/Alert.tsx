/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 18.02.2024 02:14
 */

import React, {useEffect} from "react";
import styled from "styled-components";
import {createRoot} from "react-dom/client";

const sAlertTimeout = Array();

type typeAlert = {
    defaultTimer?: string
    defaultErrorTimer?: string
    defaultSuccessTimer?: string
}


export const Alert = ({
    defaultTimer = "5000",
    defaultErrorTimer = "10000",
    defaultSuccessTimer = "5000"
}: typeAlert) => {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const divCheck = document.getElementById("salert");
        if (!divCheck) {
            // let div = document.createElement('div') as HTMLDivElement
            const div = document.createElement('div');
            div.setAttribute("id", "salert");
            div.setAttribute("defaultTimer", defaultTimer);
            div.setAttribute("defaultErrorTimer", defaultErrorTimer);
            div.setAttribute("defaultSuccessTimer", defaultSuccessTimer);
            const alertStyle = [
                "position: fixed",
                "bottom: 0",
                "right: 0",
                "max-width: 300px",
                "max-height: 600px",
                "overflow-x: hidden",
                "padding: 15px",
                "display: flex",
                "flex-direction: column",
                "z-index: 9999999",
            ];
            div.setAttribute("style", alertStyle.join(";"));
            document.body.appendChild(div);
        }
    }, [])

    return null;
}


type typeAddAlert = {
    type: "error" | "success" | "warning" | "info" | "loading",
    message: string,
    timer?: number | boolean
    style?: React.CSSProperties
}

export const alert_add = ({type, message, style, timer}: typeAddAlert) => {
    if (typeof window === "undefined") return false;
    const mainDiv = document.getElementById("salert");
    if (mainDiv) {
        const alert = document.createElement('div');
        mainDiv.prepend(alert);

        const onClose = () => {
            if (mainDiv && alert && mainDiv.contains(alert)) mainDiv.removeChild(alert)
        }
        const root = createRoot(alert!);
        const Component = <MainBase className={type} style={style}>
            <div className={"message"} dangerouslySetInnerHTML={{__html: message}}/>
            <div className={"close"} onClick={onClose}>✕</div>
        </MainBase>
        root.render(Component);


        const defaultTimer = mainDiv.getAttribute("defaulttimer") ?? "5000";
        const defaultErrorTimer = mainDiv.getAttribute("defaulterrortimer") ?? "10000";
        const defaultSuccessTimer = mainDiv.getAttribute("defaultsuccesstimer") ?? "5000";

        const timerFilled = (typeof timer === "number" && timer > 0);

        let newTimer = timerFilled ? timer : defaultTimer;

        switch (type) {
            case "error":
                newTimer = timerFilled ? timer : defaultErrorTimer;
                break;
            case "success":
                newTimer = timerFilled ? timer : defaultSuccessTimer;
                break;
            default:
                break;
        }
        newTimer = newTimer as number;

        if (typeof timer !== "boolean") {
            // False gelmişse sabit kalsın
            if (newTimer > 0) {
                const timeout = setTimeout(() => onClose(), newTimer);
                sAlertTimeout.push(timeout);
            }
        }


        return alert;
    }
    return null;
};

export const alert_remove = (alert: any): void => {
    if (typeof window === "undefined" || !alert) return;
    const mainDiv = document.getElementById("salert");
    if (mainDiv && alert && mainDiv.contains(alert)) mainDiv.removeChild(alert)
    return;
}

export const alert_clear = () => {
    if (typeof window === "undefined") return false;
    sAlertTimeout.map(id => clearTimeout(id));
    const mainDiv = document.getElementById("salert");
    if (mainDiv) mainDiv.innerHTML = "";
    return true;
}

export function alertCheck(response: any) {
    if (response.data && response.data["alert"]) {
        response.data["alert"].map(function (alert: any) {
            alert_add({
                type: alert.type,
                message: alert.message,
                timer: alert.timer
            });
        });
    }
}

const MainBase = styled.div`
    position: relative;
    //min-width: 200px;
    min-width: 50px;
    width: fit-content;
    margin: 6px 0 6px auto;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: default;
    background: #1f1f1f;
    color: rgba(255, 255, 255, 0.93);
    border: 1px #97979740 solid;
    box-shadow: 1px 1px 4px 0 #000000a6;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    animation: show 0.3s;
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.5;


    .message {
        flex: 1;
    }

    .close {
        position: absolute;
        top: 0;
        left: 0;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        padding: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        letter-spacing: 0;
        transform: translate(-50%, -50%) scale(0);
        transition: ease-in-out 0.2s;
        border: 1px #97979740 solid;
        box-shadow: 1px 1px 4px 0 #000000a6;
        cursor: pointer;
        background: inherit;

        &:hover {
            zoom: 1.1;
        }
    }

    &:hover {
        .close {
            transform: translate(-50%, -50%) scale(1);
        }
    }

    &.error {
        background: rgb(211, 47, 47);
        background: linear-gradient(135deg, rgba(211, 47, 47, 1) 0%, rgba(211, 47, 47, 0.8) 70%);
        color: rgba(255, 255, 255, 0.93);
    }

    &.success {
        background: rgb(67, 160, 71);
        background: linear-gradient(135deg, rgba(67, 160, 71, 1) 0%, rgba(67, 160, 71, 0.8) 70%);
        color: rgba(255, 255, 255, 0.93);
    }

    &.info {
        background: rgb(13, 141, 189);
        background: linear-gradient(135deg, rgba(13, 141, 189, 1) 0%, rgba(13, 141, 189, 0.8) 70%);
        color: rgba(255, 255, 255, 0.93);
    }

    &.warning {
        background: rgb(217, 142, 4);
        background: linear-gradient(135deg, rgba(217, 142, 4, 1) 0%, rgba(217, 142, 4, 0.8) 70%);
        color: rgba(255, 255, 255, 0.93);
    }

    &.loading {
        background: linear-gradient(60deg, rgb(15 33 34) 0%, rgba(0, 172, 193, 1) 100%);
        color: rgba(255, 255, 255, 0.93);
        animation: waves 50s infinite linear;
    }


    @keyframes show {
        from {
            transform: translateX(200%);
        }
        to {
            transform: translateX(0);
        }
    }

    @keyframes waves {
        from {
            background-position: 0;
        }
        to {
            background-position: 100vw 0;
        }
    }

`;