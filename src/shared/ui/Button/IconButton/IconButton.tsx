import styles from "./style.module.scss";
import { MouseEventHandler, ReactNode } from "react";
import classNames from "classnames";

export const IconButton = (props: {
    children: ReactNode;
    onClick: MouseEventHandler;
    className?: string;
}) => {
    return (
        <button className={classNames(styles.button, props.className)} onClick={props.onClick}>
            {props.children}
        </button>
    );
};
