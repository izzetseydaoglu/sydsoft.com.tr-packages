import React, { useEffect } from "react";

import { createRoot } from "react-dom/client";
import styles from "./index.module.css";

const sAlertTimeout: any[] = [];

export type typeAlert = {
    defaultTimer?: string;
    defaultErrorTimer?: string;
    defaultSuccessTimer?: string;
};

export const Alert = ({ defaultTimer = "5000", defaultErrorTimer = "10000", defaultSuccessTimer = "5000" }: typeAlert) => {
    useEffect(() => {
        if (typeof window === "undefined") return;
        const divCheck = document.getElementById("salert");
        if (!divCheck) {
            // let div = document.createElement('div') as HTMLDivElement
            const div = document.createElement("div");
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
                "z-index: 9999999"
            ];
            div.setAttribute("style", alertStyle.join(";"));
            document.body.appendChild(div);
        }
    }, []);

    return null;
};

type typeAddAlert = {
    type: "error" | "success" | "warning" | "info" | "loading";
    message: string;
    timer?: number | boolean;
    style?: React.CSSProperties;
};

export const alert_add = ({ type, message, style, timer }: typeAddAlert) => {
    if (typeof window === "undefined") return false;
    const mainDiv = document.getElementById("salert");
    if (mainDiv) {
        const alert = document.createElement("div");
        mainDiv.prepend(alert);

        const onClose = () => {
            if (mainDiv && alert && mainDiv.contains(alert)) mainDiv.removeChild(alert);
        };
        const root = createRoot(alert!);
        const Component = (
            <div className={`${styles.salert} ${styles[type]}`} style={style}>
                <div className={styles.message} dangerouslySetInnerHTML={{ __html: message }} />
                <div className={styles.close} onClick={onClose}>
                    ✕
                </div>
            </div>
        );
        root.render(Component);

        const defaultTimer = mainDiv.getAttribute("defaulttimer") ?? "5000";
        const defaultErrorTimer = mainDiv.getAttribute("defaulterrortimer") ?? "10000";
        const defaultSuccessTimer = mainDiv.getAttribute("defaultsuccesstimer") ?? "5000";

        const timerFilled = typeof timer === "number" && timer > 0;

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
    if (mainDiv && alert && mainDiv.contains(alert)) mainDiv.removeChild(alert);
    return;
};

export const alert_clear = () => {
    if (typeof window === "undefined") return false;
    sAlertTimeout.map((id) => clearTimeout(id));
    const mainDiv = document.getElementById("salert");
    if (mainDiv) mainDiv.innerHTML = "";
    return true;
};

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
