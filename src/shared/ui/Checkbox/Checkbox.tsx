import { ReactNode, useEffect, useRef } from "react";
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
    children?: ReactNode;
}) => {
    const lottieRef = useRef<LottieRefCurrentProps | null>(null);

    // useEffect(() => {
    //     if (isChecked && lottieRef.current) {
    //         const duration = lottieRef.current.getDuration(true);
    //         if (duration) {
    //             lottieRef.current.goToAndPlay(duration, true);
    //         }
    //     }
    // }, []);

    useEffect(() => {
        lottieRef.current?.setDirection(!isChecked ? -1 : 1);
        lottieRef.current?.play();
    }, [isChecked]);

    return (
        <div>
            <label className={classNames(styles.checkbox, { [styles.active]: isChecked })}>
                <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {
                        checkboxChange(!isChecked);
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
                        />
                    </div>
                </div>
            </label>
        </div>
    );
};
