import React, { memo } from "react";

import { Tooltip } from "../tooltip";
import styles from "./styles/Label.module.css";

interface Props {
    children: React.ReactNode;
    required?: boolean;
}

export const Label: React.FC<Props> = memo(function FMemo(props) {
    const { required, children, ...other } = props;
    return (
        <label className={styles.label} {...other}>
            {children}
            <Tooltip title={"Zorunlu Alan"}>
                <span className={styles.required}>{required && "*"}</span>
            </Tooltip>
        </label>
    );
});
Label.defaultProps = {
    required: false
};
