import React, { ReactNode } from "react";
import styles from "./Button.module.scss";
import Lottie from "lottie-react";
import loadAnimatinon from "../../assets/animation/Loading.json";
import classNames from "classnames";

export const Button = ({
    onClick,
    children,
    isLoading,
    disabled,
    icon,
    skinny,
}: {
    onClick: () => void;
    children: ReactNode;
    isLoading: boolean;
    disabled: boolean;
    icon?: ReactNode;
    skinny?: boolean;
}) => {
    return (
        <button
            className={classNames(styles.button, { [styles.skinny]: skinny })}
            disabled={disabled}
            onClick={onClick}
        >
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
