import React, { ReactNode } from "react";
import styles from "./Button.module.scss";
import Lottie from "lottie-react";
import loadAnimatinon from "../../assets/animation/Loading.json";

export const Button = ({
    onClick,
    children,
    isLoading,
    disabled,
    icon,
}: {
    onClick: () => void;
    children: ReactNode;
    isLoading: boolean;
    disabled: boolean;
    icon?: ReactNode;
}) => {
    return (
        <button className={styles.button} disabled={disabled} onClick={onClick}>
            {isLoading ? (
                <div className={styles.animation}>
                    <Lottie animationData={loadAnimatinon} loop={true} />
                </div>
            ) : (
                <>
                    {icon}
                    {children}
                </>
            )}
        </button>
    );
};
