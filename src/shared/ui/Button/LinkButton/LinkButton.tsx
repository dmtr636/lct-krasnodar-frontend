import styles from "./style.module.scss";
import { IconAdd } from "src/shared/assets/img";
import React, { ReactNode } from "react";
import classNames from "classnames";

export const LinkButton = (props: {
    onClick: React.MouseEventHandler;
    children: ReactNode;
    icon?: ReactNode;
    className?: string;
}) => {
    return (
        <button className={classNames(styles.button, props.className)} onClick={props.onClick}>
            {props.icon && <div className={styles.icon}>{props.icon}</div>}
            <div className={styles.text}>{props.children}</div>
        </button>
    );
};
