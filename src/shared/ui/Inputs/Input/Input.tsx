import { ChangeEvent, useState } from "react";
import classNames from "classnames";
import styles from "./styles.module.scss"; /*
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import attentionStart from "../../../assets/animation/attention_start.json"; */

export const Input = ({
    onChange,
    /*     setEmailIsValidated,
     */ inputValue,
    labelName,
    type,
} /*     error,
 */ : {
    onChange: (value: string) => void;
    labelName: string;
    /*     setEmailIsValidated: (arg: boolean) => void;
    error: boolean; */
    inputValue: string;
    type?: string;
}) => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    /*     const [emailIsValid, setEmailIsValid] = useState(true);
     */ /* const [firstFocus, setfirstFocus] = useState(false); */

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
        /*  const isValid = emailRegex.test(event.target.value);
        setEmailIsValid(isValid);
        setEmailIsValidated(isValid); */
    }; /*
    const ShowEmailError =
        !emailIsValid && !isInputFocused && firstFocus && !(inputValue.trim() === ""); */
    /*   const handleInputFocus = (): void => {
        setIsInputFocused(true);
        setfirstFocus(true);

        if (ShowEmailError) {
            lottieRef.current?.play();
            lottieRef.current?.setDirection(-1);
        }
    }; */
    const handleInputFocus = (): void => {
        setIsInputFocused(true);
        /* setfirstFocus(true); */
    };
    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };
    /*     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     */
    /*     const lottieRef = React.useRef<LottieRefCurrentProps | null>(null);
     */
    return (
        <div>
            <div className={styles.inputContainer}>
                <div
                    className={classNames(styles.inputBorder, {
                        [styles.active]: isInputFocused,
                        /*                         [styles.error]: ShowEmailError || error,
                         */
                    })}
                />
                <input
                    type={type || "text"}
                    value={inputValue}
                    className={styles.input}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                />
                <label
                    className={classNames(styles.inputLabel, {
                        [styles.active]: isInputFocused || inputValue !== "",
                    })}
                >
                    {labelName}
                </label>
                <div
                    className={classNames(styles.passShowBlock, {
                        [styles.active]: isInputFocused,
                    })}
                >
                    {/* <div className={styles.passShow}>
                        <Lottie
                            lottieRef={lottieRef}
                            autoplay={false}
                            animationData={attentionStart}
                            loop={false}
                        />
                    </div> */}
                </div>
            </div>

            {/* {ShowEmailError && (
                <div className={styles.wrongEmail}>Нужна почта в формате example@mail.com</div>
            )} */}
        </div>
    );
};
