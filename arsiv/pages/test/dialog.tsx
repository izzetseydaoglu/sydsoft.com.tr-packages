import { BoxContent } from "@/@base";
import { Button } from "@/@base/form/Button";
import { Dialog } from "@/@base/form/Dialog";

export default function Test() {
    const buttons = ["default", "primary", "secondary", "success", "danger", "warning", "info", "light", "dark", "link"];
    return (
        <BoxContent padding={20} style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            <Button buttonClass="primary"
            onClick={() => {
                Dialog({
                    message: "Are you sure you want to proceed?",
                    acceptButtonText: "Yes",
                    cancelButtonText: "No",
                }).then((result) => {
                    alert(`Result: ${result}`);
                });
            }}
            >Open Dialog </Button>
        </BoxContent>
    );
}
