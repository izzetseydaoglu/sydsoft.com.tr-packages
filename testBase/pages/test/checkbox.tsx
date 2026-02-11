import { useEffect, useState } from "react";

import { BoxContent } from "@sydsoft/base";
import { Checkbox } from "@sydsoft/base/form/Checkbox";

export default function Test() {
    const [checked, setChecked] = useState<boolean | "0" | "1">("1");

    useEffect(() => {
        // Component mounted or checked changed
        console.log("Checkbox checked state:", checked);
    }, [checked]);

    return (
        <BoxContent padding={20} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Checkbox checked={checked} label="Checkbox Label" onToogle={(e) => setChecked(e.target.value)}>
                Değişik bir şeyler eklenebilir. Mesela <b>bold</b> bir yazı.
            </Checkbox>
        </BoxContent>
    );
}
