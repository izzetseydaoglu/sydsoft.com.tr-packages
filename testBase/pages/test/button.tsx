import { BoxContent, Icon } from "@sydsoft/base";

import { Button } from "@sydsoft/base/form/Button";

export default function Test() {
    const buttons = ["default", "primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"];
    return (
        <BoxContent padding={20} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Button href="/test/button" buttonClass="primary">
                Active URL
            </Button>
            {buttons.map((variant: any) => (
                <Button key={variant} buttonClass={variant}>
                    {variant}
                </Button>
            ))}
            <Button fullWidth buttonClass="primary">
                Full
            </Button>
            <Button onlyIcon={<Icon iconMui="add" />} />
            <Button onlyIcon={<Icon iconMui="save" />} />
            <Button onlyIcon={<Icon iconMui="delete" />} /> <br />
            <Button buttonClass="primary" buttonSize="small">
                small
            </Button>
            <Button buttonClass="primary">medium</Button>
            <Button buttonClass="primary" buttonSize="large">
                large
            </Button>
        </BoxContent>
    );
}
