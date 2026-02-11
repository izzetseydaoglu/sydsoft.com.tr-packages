/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:44
 */

import { Tooltip } from "@sydsoft/base/tooltip";

export default function Home() {
    return (
        <main>
            <Tooltip title={"Test"}>
                <span>Hover over me</span>
            </Tooltip>
        </main>
    );
}
