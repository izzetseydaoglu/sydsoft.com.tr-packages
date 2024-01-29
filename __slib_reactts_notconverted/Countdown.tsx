/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 29.01.2024 04:09
 */

import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import {useInterval} from "./_lib/useInterval";

type Props = {
    children?: any,
    hide?: boolean,
    targetTime: number | string, // 30 | "2022-01-20 22:35" | veya direkt microtime ;
    timerType?: "countdown" | "datetime",
    countType?: "seconds" | "minutes:seconds" | "hours:minutes:seconds" | "days:hours:minutes:seconds",
    timerSpeed?: number,
    onComplete?: Function
    getStatus?: Function
    autoStart?: boolean
}

type CountDownHandle = {
    start: () => void;
    stop: () => void;
    setTimer: (targetTime: any) => void;
    getChildrenRef: () => any;
};


const CountDown: React.ForwardRefRenderFunction<CountDownHandle, Props> = ({
    autoStart = false,
    onComplete, getStatus, targetTime, timerType = "countdown", countType = "seconds", timerSpeed = 1000, children, hide
}, forwardedRef) => {


    const refCountDownRender = useRef<any>();
    const [enabled, setEnabled] = useState((timerType === "datetime") || autoStart);
    const [timer, setTimer] = useState<any>(0);

    useImperativeHandle(forwardedRef, () => ({
        start: () => {
            setEnabled(true);
        },
        stop: () => {
            setEnabled(false);
        },
        setTimer: (targetTime: any) => {
            setTimer(targetTime);
        },
        getChildrenRef: () => refCountDownRender.current || null
    }));

    useEffect(() => {
        if (timerType === "datetime") {
            setTimer(Math.floor((new Date(targetTime).getTime() - new Date().getTime()) / 1000));
            setEnabled(true);
        } else {
            setTimer(targetTime);
        }
    }, [targetTime]);

    useEffect(() => {
        if (!hide) render();
    }, [timer]);

    useInterval(() => {
        if (enabled) {
            if (timer <= 1) {
                setTimer(0);
                setEnabled(false);
                if (onComplete) onComplete();
            } else {
                setTimer(timer - 1);
            }
        }
    }, enabled ? timerSpeed : null);

    // @ts-ignore
    const padNumber = (num: number, padLength = 2, padString = "0") => targetTime < 10 ? num : String(num).padStart(padLength, padString);

    const render = () => {
        let days = 0, hours = 0, minutes = 0, seconds = timer;
        if (countType === "minutes:seconds") {
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        } else if (countType === "hours:minutes:seconds") {
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60;
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        } else if (countType === "days:hours:minutes:seconds") {
            days = Math.floor(seconds / (60 * 60 * 24));
            seconds -= days * 60 * 60 * 24;
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60;
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        }

        seconds = Math.floor(seconds);

        if (getStatus && timer > 0) getStatus({days, hours, minutes, seconds, timer: timer})

        if (refCountDownRender) {

            const getPadValues = (div: any) => {
                const length = div.dataset.padlength || 2;
                const string = div.dataset.padstring || "0";
                return {length, string}
            }

            const divGun = refCountDownRender.current.querySelector("[data-name='days']");
            if (divGun) divGun.innerHTML = padNumber(days, getPadValues(divGun).length, getPadValues(divGun).string).toString();

            const divSaat = refCountDownRender.current.querySelector("[data-name='hours']");
            if (divSaat) divSaat.innerHTML = padNumber(hours, getPadValues(divSaat).length, getPadValues(divSaat).string).toString();

            const divDakika = refCountDownRender.current.querySelector("[data-name='minutes']");
            if (divDakika) divDakika.innerHTML = padNumber(minutes, getPadValues(divDakika).length, getPadValues(divDakika).string).toString();

            const divSaniye = refCountDownRender.current.querySelector("[data-name='seconds']");
            if (divSaniye) divSaniye.innerHTML = padNumber(seconds, getPadValues(divSaniye).length, getPadValues(divSaniye).string).toString();
        }
    };

    return hide ? null : React.cloneElement(children, {ref: refCountDownRender});
};

export default React.forwardRef(CountDown);



