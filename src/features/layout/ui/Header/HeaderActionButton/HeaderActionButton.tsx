import styles from "./style.module.scss";
import { ReactNode } from "react";
import classNames from "classnames";

export const HeaderActionButton = (props: {
    children: ReactNode;
    onClick: () => void;
    icon?: ReactNode;
    color?: "primary" | "delete";
    variant?: "outlined" | "contained";
    className?: string;
}) => {
    return (
        <button
            className={classNames(
                styles.button,
                {
                    [styles.delete]: props.color === "delete",
                    [styles.contained]: props.variant === "contained",
                },
                props.className,
            )}
            onClick={props.onClick}
        >
            {props.icon}
            {props.children}
        </button>
    );
};
