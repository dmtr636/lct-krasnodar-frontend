import styles from "./style.module.scss";
import { ReactNode } from "react";

export const IconButton = (props: { children: ReactNode; onClick: () => void }) => {
    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.children}
        </button>
    );
};
