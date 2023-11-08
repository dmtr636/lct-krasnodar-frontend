import styles from "./style.module.scss";
import { IconAdd } from "src/shared/assets/img";
import React, { ReactNode } from "react";

export const LinkButton = (props: {
    onClick: React.MouseEventHandler;
    children: ReactNode;
    icon?: ReactNode;
}) => {
    return (
        <button className={styles.button} onClick={props.onClick}>
            {props.icon && (
                <div className={styles.icon}>
                    <IconAdd />
                </div>
            )}
            {props.children}
        </button>
    );
};
