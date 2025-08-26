import { BoxContent, Button, Icon, Input, isDev } from "@/@base";
import { useEffect, useRef, useState } from "react";

import { applyInputMask } from "@/@base/_lib/inputMask";

export default function Test() {
    const [value, setValue] = useState("(542)-544-68-26");
    const [valueSelect, setValueSelect] = useState("2");
    const inputRef = useRef();

    useEffect(() => {
        isDev && console.log("Input value changed:", value);
    }, [value]);
    useEffect(() => {
        isDev && console.log("Select value changed:", valueSelect);
    }, [valueSelect]);

    useEffect(() => {
        const mask = "(000) 000-00-00";
        // const mask = "00000000000";
        const maskInstance = applyInputMask(inputRef.current, mask, {
            onChange: (masked: any, clean: any) => console.log(masked, clean),
            reverse: false,
            clearIncomplete: true
        });
        return () => maskInstance?.destroy(); // cleanup
    }, []);
    return (
        <BoxContent style={{ padding: 20 }}>
            <Input inputRef={inputRef} required label="Dışardan" value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} startAdornment={<Icon iconMui="lock" />} />
            <br />
            <Input
                name="inputTest"
                label="Telefon No"
                mask="(000)-000-00-00"
                // maskSettings={{ clearIfNotMatch: false }}
                value={value}
                onChange={(e: { target: { value: any } }) => {
                    isDev && console.log("change", value);
                    setValue(e.target.value);
                }}
            />
            <br />
            <br />
            <Input startAdornment={<Icon iconMui="lock" />} loading value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input
                label="Label"
                required
                propsComponent={{
                    style: {
                        backgroundColor: "#a1c009"
                    }
                }}
                value={value}
                onChange={(e: { target: { value: any } }) => setValue(e.target.value)}
            />{" "}
            <br />
            <Input disabled required label="PlaceHolder" placeholder="Placeholder" value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input label="Date" type="date" dateGecmisKontrol value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input label="Email" type="email" value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input label="Dosya No" dosyaNoGiris={true} value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input label="Textarea" multiline rows={4} value={value} onChange={(e: { target: { value: any } }) => setValue(e.target.value)} /> <br />
            <Input
                label="Select"
                select={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" }
                ]}
                ilkSec={false}
                value={valueSelect}
                onChange={(e: { target: { value: any } }) => setValueSelect(e.target.value)}
            />
            <br />
            <Input
                label="Select"
                value={valueSelect}
                ilkSec={false}
                select={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" }
                ]}
                onChange={(e: { target: { value: any } }) => setValueSelect(e.target.value)}
            />
            <br />
            <Button type="submit">Save</Button>
        </BoxContent>
    );
}
