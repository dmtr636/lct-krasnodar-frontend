import styles from "./style.module.scss";
import { ReactNode } from "react";
import classNames from "classnames";

export const HeaderActionButton = (props: {
    children: ReactNode;
    onClick: () => void;
    icon?: ReactNode;
    color?: "primary" | "delete";
}) => {
    return (
        <button
            className={classNames(styles.button, {
                [styles.delete]: props.color === "delete",
            })}
        >
            {props.icon}
            {props.children}
        </button>
    );
};
