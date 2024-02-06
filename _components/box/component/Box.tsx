/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */

import React, {memo, useEffect, useRef, useState} from "react";
import styled from "styled-components";

type Props = {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    margin?: string
    padding?: number
    loading?: boolean
    fullScreen?: boolean
}

export const Box = memo(function MemoFunction({children, className, style, margin = "0 0 20px 0", padding = 20, loading = false, fullScreen = false}: Props) {
    const refMain = useRef<any>(null);
    const [fullHeightContent, setFullHeightContent] = useState<any>("100%");

    useEffect(() => {
        setTimeout(() => {
            if (refMain.current) {
                let diff = 0;
                const header = refMain.current.getElementsByClassName("sbox_header")[0];
                if (header) diff += header.getBoundingClientRect().height;
                const footer = refMain.current.getElementsByClassName("sbox_footer")[0];
                if (footer) diff += footer.getBoundingClientRect().height;
                setFullHeightContent(`calc(100vh - ${diff}px)`);
            }
        }, 500);
    }, []);

    return <MainBase
        ref={refMain}
        className={className ? "sbox " + className : "sbox"}
        style={style}
        $margin={fullScreen ? "0" : margin}
        $padding={fullScreen ? 0 : padding}
        $fullScreen={fullScreen}
    >
        {(fullScreen) ? <div style={{height: fullHeightContent}}>{children}</div> : children}
        {loading && <div className={"loading"}>
            <div className={"loading_spinner"}/>
        </div>}
    </MainBase>;
})

const MainBase = styled.div<any>`
    position: relative;
    //width: 100%;
    max-width: 100%;
    margin: ${({$margin}) => $margin};
    padding: ${({$padding}) => $padding}px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgb(0 0 0 / 10%), 0 8px 16px rgb(0 0 0 / 10%);
    border-radius: 8px;
    ${({$fullScreen}) => ($fullScreen) && `
        height: 100%;
        margin:0;
        padding:0;
        border-radius:0;
   `};

    .sbox_header {
        position: relative;
        min-width: 100%;
        //min-height: 50px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        margin: 10px 0 5px 0;
        padding: 5px 15px;
        background: #fff;
        color: #646465;
        border-bottom: 1px solid #E6E5E6;
        margin-top: -${({$padding}) => $padding}px;
        margin-left: -${({$padding}) => $padding}px;
        margin-right: -${({$padding}) => $padding}px;
        margin-bottom: 15px;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        & > .icon {
            display: inline-flex;
            align-items: center;
            flex: 0 0 auto;
            text-align: center;
            margin-right: 5px;
        }

        & > .title {
            flex: 1;
            font-size: 15px;
            font-weight: 500;
            line-height: 1;
            padding: 10px 0;
        }

        & > .menu {
            display: inline-flex;
            flex: 0 0 auto;
            align-items: center;
            justify-content: center;
            margin-left: 5px;
            margin-right: -10px;

            & > * {
                margin: 0 3px;
            }
        }
    }

    .sbox_footer {
        border-top: 1px solid #E6E5E6;
        border-radius: inherit;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        margin-top: 15px;
        margin-bottom: -${({$padding}) => $padding}px;
        margin-left: -${({$padding}) => $padding}px;
        margin-right: -${({$padding}) => $padding}px;
    }

    & > .loading {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: #f4f7faa6;
        overflow: hidden;
        border-radius: inherit;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;

        &::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background: linear-gradient(90deg, rgb(183 190 199 / 2%) 0, rgb(182 190 198 / 19%) 20%, rgb(183 190 199 / 2%) 60%, rgb(184 192 200 / 1%));
            animation: shimmer 2s infinite;
            content: '';
        }

        .loading_spinner {
            position: relative;
            //margin: 0 15px 50px 15px;
            margin: 6px;
            width: 24px;
            height: 24px;

            &:before {
                position: absolute;
                display: block;
                content: '';
                z-index: 12;
                top: 3px;
                left: 3px;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                background-color: #fff;
            }

            &:after {
                position: absolute;
                display: block;
                content: '';
                z-index: 11;
                width: 18px;
                height: 18px;
                border-radius: 200px 0 0;
                background: linear-gradient(45deg,
                rgba(0, 0, 0, 0) 0,
                rgba(69, 154, 215, 1) 50%,
                rgba(69, 154, 215, 1) 100%);
                animation: loading_spinner 0.5s linear infinite;
            }
        }

        @keyframes shimmer {
            100% {
                transform: translateX(100%);
            }
        }
        @keyframes loading_spinner {
            0% {
                transform-origin: 100% 100%;
                transform: rotate(0deg);
            }

            100% {
                transform-origin: 100% 100%;
                transform: rotate(360deg);
            }
        }
    }
`;