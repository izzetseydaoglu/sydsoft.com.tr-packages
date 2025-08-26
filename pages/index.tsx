/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 18.02.2024 02:14
 */

import Link from "next/link";

export default function Home() {
    return (
        <main>
            <Link href={"/test/box"}>Box</Link>
            <br />
            <Link href={"/test/tooltip"}>ToolTip</Link>
            <br />
            <Link href={"/test/popover"}>Popover</Link>
            <br />
            <Link href={"/test/modal"}>Modal</Link>
            <br />
            <Link href={"/test/datetime"}>DateTime</Link>
            <br />
            <Link href={"/test/button"}>Button</Link>
            <br />
            <Link href={"/test/dialog"}>Dialog</Link>
            <br />
            <Link href={"/test/input"}>Input</Link>
            <br />
            <Link href={"/test/checkbox"}>Checkbox</Link>
        </main>
    );
}
