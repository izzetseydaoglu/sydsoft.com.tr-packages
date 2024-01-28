import React from "react";
import styled from "styled-components";

interface Props {
    children: React.ReactNode,
    className?: string,
    style?: React.CSSProperties,
    marginTop?: number,
}

export const BoxFooter: React.FC<Props> = React.memo(({children, className, style, marginTop}) => {
    return <MainBase
        className={(className) ? "sbox_footer " + className : "sbox_footer"}
        style={{
            marginTop,
            ...style
        }}
    >
        {children}
    </MainBase>
})

const MainBase = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background: #f7f7f7;

    & > * {
        margin: 0 5px;
    }
`;