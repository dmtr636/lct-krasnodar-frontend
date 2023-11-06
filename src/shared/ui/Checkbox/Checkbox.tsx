import React, { ReactNode, useRef } from "react";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import styles from "./Checkbox.module.scss";
import animationChecked from "../../assets/animation/checkbox_fill.json";

import classNames from "classnames";

export const Checkbox = ({
    checkboxChange,
    isChecked,
    children,
}: {
    checkboxChange: (arg: boolean) => void;
    isChecked: boolean;
    children: ReactNode;
}) => {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);
    return (
        <div>
            <label className={classNames(styles.checkbox, { [styles.active]: isChecked })}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                        checkboxChange(!isChecked);
                        lottieRef.current?.setDirection(isChecked ? -1 : 1);
                        lottieRef.current?.play();
                    }}
                    style={{ display: "none" }}
                />
                {children}
                <div className={styles.checkboxBlock}>
                    <div
                        className={
                            isChecked ? styles.checkboxContainerActive : styles.checkboxContainer
                        }
                    >
                        <Lottie
                            lottieRef={lottieRef}
                            autoplay={false}
                            loop={false}
                            animationData={animationChecked}
                            reversed={true}
                        />
                    </div>
                </div>
            </label>
        </div>
    );
};
