import { useEffect, useRef, useState } from 'react';

import React from 'react';
import { useInterval } from '../_lib/useInterval';

type Props = {
    targetTime: number | string; // 30 | "2022-01-20 22:35" | veya direkt microtime ;
    timerType?: 'countdown' | 'datetime';
    speed?: number;
    countType?: 'seconds' | 'minutes:seconds' | 'hours:minutes:seconds' | 'days:hours:minutes:seconds';
    hide?: boolean;
    onComplete?: () => void;
    getStatus?: ({ days, hours, minutes, seconds, timer }: any) => void;
    autoStart?: boolean;
};

export const useCountDown = ({ autoStart = false, onComplete, getStatus, targetTime, timerType = 'countdown', countType = 'seconds', speed = 1000, hide }: Props) => {
    const refCountDownRender = useRef<any>(null);
    const [enabled, setEnabled] = useState(timerType === 'datetime' || autoStart);
    const [timer, setTimer] = useState<any>(0);
    const [timerSpeed, setTimerSpeed] = useState<number>(typeof speed === 'number' && speed > 0 ? speed : 1000);

    useEffect(() => prepareTimer(targetTime), [targetTime]);

    useEffect(() => {
        if (!hide) render();
    }, [timer]);

    useInterval(
        () => {
            if (enabled) {
                if (timer <= 1) {
                    stopCountDown();
                } else {
                    setTimer(timer - 1);
                }
            }
        },
        enabled ? timerSpeed : null
    );

    const prepareTimer = (timeORstring: string | number) => {
        if (timerType === 'datetime') {
            setTimer(Math.floor((new Date(timeORstring).getTime() - new Date().getTime()) / 1000));
            setEnabled(true);
        } else {
            setTimer(timeORstring);
        }
    };

    const stopCountDown = () => {
        setTimer(0);
        setEnabled(false);
        if ((enabled && onComplete) || (timerType === 'datetime' && onComplete)) {
            onComplete();
        }
    };

    const padNumber = (num: number, padLength = 2, padString = '0') => (typeof targetTime === 'number' && targetTime < 10 ? num : String(num).padStart(padLength, padString));

    const render = () => {
        let days = 0,
            hours = 0,
            minutes = 0,
            seconds = timer;
        if (countType === 'minutes:seconds') {
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        } else if (countType === 'hours:minutes:seconds') {
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60;
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        } else if (countType === 'days:hours:minutes:seconds') {
            days = Math.floor(seconds / (60 * 60 * 24));
            seconds -= days * 60 * 60 * 24;
            hours = Math.floor(seconds / (60 * 60));
            seconds -= hours * 60 * 60;
            minutes = Math.floor(seconds / 60);
            seconds -= minutes * 60;
        }

        seconds = Math.floor(seconds);

        if (getStatus && timer > 0) getStatus({ days, hours, minutes, seconds, timer });

        if (refCountDownRender.current) {
            const getPadValues = (div: any) => {
                const length = div.dataset.padlength || 2;
                const string = div.dataset.padstring || '0';
                return { length, string };
            };

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

    return {
        ComponentCountDown: (children: any) => (hide ? null : React.cloneElement(children, { ref: refCountDownRender })),
        startCountDown: () => setEnabled(true),
        stopCountDown: () => setEnabled(false),
        setTargetTime: (targetTime: number | string) => prepareTimer(targetTime),
        setTimerSpeed: (timerSpeed: number) => setTimerSpeed(timerSpeed),
        getChildrenRef: () => refCountDownRender.current || null
    };
};
