/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 31.01.2024 02:50
 */

import React from "react";
import {Box} from "@/_components/box/component/Box";
import {BoxFooter, BoxHeader} from "@/_components/box/component";
import {Col, Row} from "@/_components/grid/component";

export default function Home() {
    return (
        <main>
            asdasd

            <Row>
                <Col xs={"auto"}>1</Col>
                <Col xs={"full"}>full</Col>
                <Col xs={3}>2</Col>
            </Row>


            <Box margin={"50px"} fullScreen={false}>
                <BoxHeader title={"Test"} component={"h2"}/>
                asd
                <BoxFooter>Deneme</BoxFooter>
            </Box>
        </main>
    );
}
