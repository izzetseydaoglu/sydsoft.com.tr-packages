import { BoxContent, SearchableInput } from "@sydsoft/base";

import { useState } from "react";

export default function Test() {
    const [value, setValue] = useState<string | undefined>("2");
    return (
        <BoxContent style={{ padding: 20 }}>
            <SearchableInput
                api={true}
                label="Searchable Input"
                loading={true}
                name="searchableInput"
                autoCompleteList={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" }
                ]}
                value={value}
                onChange={(e: any) => setValue(e.target.value)}
                newCreate={true}
            />
        </BoxContent>
    );
}
