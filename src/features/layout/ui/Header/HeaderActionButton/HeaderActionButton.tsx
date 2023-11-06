import styles from "./style.module.scss";
import { ReactNode } from "react";

export const HeaderActionButton = (props: {
    children: ReactNode;
    onClick: () => void;
    icon?: ReactNode;
}) => {
    return (
        <button className={styles.button}>
            {props.icon}
            {props.children}
        </button>
    );
};
