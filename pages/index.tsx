/**
 * Copyright (c) 2024
 *  @author: izzetseydaoglu
 *  @last-modified: 18.02.2024 02:14
 */

import Link from "next/link";
import {useEffect} from "react";
import {alert_add} from "@/_components/alert/component";

export default function Home() {

    useEffect(() => {
        setTimeout(() => {

            alert_add({type: "success", message: "Test"})
            alert_add({
                type: "error", message: "sabit error",
                style: {backgroundColor: "#455"},
                timer: false
            })
            alert_add({type: "info", message: "Test Hey gidsda das asd asd asd asd asd asdas dadadasd asdi dünya......asd kaskdjaskdjlajsdl kajsdljalsdjakdsjl"})

        }, 1000);
    }, []);

    return (
        <main>
            <Link href={"/test/box"}>Box</Link><br/>
        </main>
    );
}
