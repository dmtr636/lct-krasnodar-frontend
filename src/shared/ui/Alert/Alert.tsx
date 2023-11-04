import { /* React, */ ReactNode, useRef } from "react";
import styles from "./Alert.module.scss";
import Lottie, { LottieRefCurrentProps } from "lottie-react";

import attentionStart from "../../assets/animation/attention_start.json";

/* import closeStart from "../../assets/animation/close_start.json";
 */
export const Alert = ({
    children,
    setIsError,
}: {
    children?: ReactNode;
    setIsError: (arg: boolean) => void;
}) => {
    /*     const [errorClose, setErrorClose] = React.useState(false);
     */ const lottieRefAttention = useRef<LottieRefCurrentProps | null>(null);
    /*     const lottieRefClose = useRef<LottieRefCurrentProps | null>(null);
     */ /* const onCloseAlert = () => {
        setErrorClose(true);
        lottieRefAttention.current?.setDirection(-1);
        lottieRefClose.current?.setDirection(-1);
        lottieRefAttention.current?.play();
        lottieRefClose.current?.play();
    }; */
    /*   const onAnimationComplete = () => {
        errorClose && setIsError(false);
    }; */
    return (
        <div className={styles.body}>
            <div className={styles.lottie}>
                <Lottie
                    lottieRef={lottieRefAttention}
                    animationData={attentionStart}
                    loop={false}
                />
            </div>

            <div className={styles.text}>{children}</div>

            {/* <button className={styles.button} onClick={() => onCloseAlert()}>
                <div className={styles.buttonClose}>
                    <Lottie
                        animationData={closeStart}
                        loop={false}
                        lottieRef={lottieRefClose}
                        onComplete={() => onAnimationComplete()}
                    />
                </div>
            </button> */}
        </div>
    );
};
