import React, { ChangeEvent, useState } from "react";
import classNames from "classnames";
import styles from "./Input.module.scss";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import attentionStart from "../../../assets/animation/attention_start.json";

export const Input = ({
    onChange,
    inputValue,
    placeholder,
    type,
}: {
    onChange: (value: string) => void;
    inputValue: string;
    placeholder: string;
    type?: string;
}) => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    };
    const handleInputFocus = (): void => {
        setIsInputFocused(true);
    };

    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };

    const lottieRef = React.useRef<LottieRefCurrentProps | null>(null);

    return (
        <div>
            <div className={styles.inputContainer}>
                <div
                    className={classNames(styles.inputBorder, {
                        [styles.active]: isInputFocused,
                    })}
                />
                <input
                    type={type ?? "text"}
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
                    {placeholder}
                </label>
                <div
                    className={classNames(styles.passShowBlock, {
                        [styles.active]: isInputFocused,
                    })}
                >
                    <div className={styles.passShow}>
                        <Lottie
                            lottieRef={lottieRef}
                            autoplay={false}
                            animationData={attentionStart}
                            loop={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
