/**
 * Copyright (c) 2023
 *  @author: izzetseydaoglu
 *  @last-modified: 30.01.2024 04:44
 */

import { Modal } from "@sydsoft/base";
import { useState } from "react";

export default function Home() {
    const [modal1Open, setModal1Open] = useState(false);
    const [modal2Open, setModal2Open] = useState(false);
    return (
        <main>
            Modal Test Page
            <button onClick={() => setModal1Open(true)}>Open</button>
            <Modal open={modal1Open} close={() => setModal1Open(false)} hideBackdrop={false} modalStyle={{ width: 300, height: 300, backgroundColor: "white" }}>
                <div style={{ padding: 20, display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Modal</div>
            </Modal>
            <button onClick={() => setModal2Open(true)}>OpenFullScreen</button>
            <Modal open={modal2Open} fullScreen={true} close={() => setModal2Open(false)}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>Modal</div>
            </Modal>
        </main>
    );
}
