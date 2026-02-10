import { UploadBase, isDev } from "@/@base";
import { useEffect, useState } from "react";

export default function Test() {
    const [form, setForm] = useState<any>({
        uploadBaseList: {},
        uploadBaseListName: ""
    });

    useEffect(() => {
        isDev && console.log("UploadForm", form);
    }, [form]);

    return (
        // <BoxContent style={{ padding: 20 }}>
            <UploadBase
                component={"div"}
                // ext_ok={["*","udf", "UDF"]}
                onChange={(e: any) => {
                    isDev && console.log(e);
                }}
                maxFile={1}
                multiple={true}
                targetForm={setForm}>
                <div>
                    {/* <Icon iconMui="upload_file" /> */}
                    <p>Cihazdan belge seçin</p>
                </div>
            </UploadBase>
        // </BoxContent>
    );
}
