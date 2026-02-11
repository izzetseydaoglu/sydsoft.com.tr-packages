/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:44
 */

import dateTime from "@sydsoft/base/dateTime";

export default function Home() {
    const tarih = new dateTime();
    return (
        <main>
            DateTime <br />
            Bugün: {tarih.today()} <br />
            Yarın: {tarih.addDays(1).format("y-m-d").getResult()} <br />
            1 ay sonra: {tarih.addDays(30).format("y-m-d").getResult()} <br />
        </main>
    );
}
