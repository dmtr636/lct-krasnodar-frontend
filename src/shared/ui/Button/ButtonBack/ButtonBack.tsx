import React, { ReactNode } from "react";
import styles from "./ButtonBack.module.scss";
import { ReactComponent as Back } from "../../../assets/img/Back.svg";
export const ButtonBack = ({
    isDisabled,
    onClick,
    children,
}: {
    isDisabled?: boolean;
    onClick: () => void;
    children?: ReactNode;
}) => {
    return (
        <>
            <button disabled={isDisabled} className={styles.buttonBack} onClick={() => onClick()}>
                <Back className={styles.buttonBackq} />
                {children}
            </button>
        </>
    );
};
