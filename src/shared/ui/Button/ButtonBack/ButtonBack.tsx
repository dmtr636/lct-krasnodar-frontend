import React from "react";
import styles from "./ButtonBack.module.scss";
import { ReactComponent as Back } from "../../../assets/img/Back.svg";
export const ButtonBack = ({
    isDisabled,
    onClick,
}: {
    isDisabled?: boolean;
    onClick: () => void;
}) => {
    return (
        <>
            <button disabled={isDisabled} className={styles.buttonBack} onClick={() => onClick()}>
                <Back className={styles.buttonBackq} />
            </button>
        </>
    );
};
