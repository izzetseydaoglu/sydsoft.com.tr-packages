/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:44
 */

import { Popover } from "@/@base";

export default function Home() {
    return (
        <main>
            <Popover component={<div>Test</div>}>
                <span>Click over me</span>
            </Popover>

            <Popover component={<div style={{ cursor: "pointer", width:50, margin: "0 auto", backgroundColor: "lightgray" }}>Test</div>}>
                <span style={{ width: 100, height: 100, backgroundColor: "#455" }}>Click over me</span>
            </Popover>
        </main>
    );
}
