/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 6.02.2024 23:45
 */

import React from "react";
import {Col, Row} from "@/_components/grid/component";
import styled from "styled-components";

export default function Home() {
    return (
        <main>
            <div>Gird</div>

            <MainBase>
                <Row rowSpacing={2} colSpacing={2}>
                    <Col xs={"auto"}>1</Col>
                    <Col xs={"full"}>full</Col>
                    <Col xs={3}>2</Col>
                </Row>

                <Row rowSpacing={2} colSpacing={2}>
                    <Col xs={"auto"}>1</Col>
                    <Col xs={"full"}>full</Col>
                    <Col xs={3}>2</Col>
                </Row>

            </MainBase>

        </main>
    );
}
const MainBase = styled.div<any>`
    display: block;

    .row {
        //border: 1px solid blue;
    }

    .col {
        //border: 1px solid red;
    }
`;