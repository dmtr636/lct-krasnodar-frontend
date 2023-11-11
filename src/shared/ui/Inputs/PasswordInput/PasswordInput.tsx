import React, { useState, ChangeEvent } from "react";
import classNames from "classnames";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import styles from "./PasswordInput.module.scss";
import showPass from "../../../assets/animation/eye_open.json";

export const PasswordInput = ({
    onChange,
    error,
    inputValue,
}: {
    onChange: (value: string) => void;
    error: boolean;
    inputValue: string;
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
    const [showPassword, setShowPassword] = React.useState(false);

    const handleTogglePassword = (): void => {
        setShowPassword(!showPassword);
        lottieRef.current?.setDirection(showPassword ? -1 : 1);
        lottieRef.current?.play();
    };
    const lottieRef = React.useRef<LottieRefCurrentProps | null>(null);
    return (
        <div>
            <div className={styles.inputContainer}>
                <div
                    className={classNames(styles.inputBorder, {
                        [styles.active]: isInputFocused,
                        [styles.error]: error,
                    })}
                />
                <div
                    className={classNames(styles.inputContainer, {
                        [styles.focused]: isInputFocused,
                    })}
                >
                    <input
                        type={showPassword ? "text" : "password"}
                        value={inputValue}
                        className={classNames(styles.input)}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        autoComplete="new-password"
                    />
                    <label
                        className={classNames(styles.inputLabel, {
                            [styles.active]: inputValue !== "" || isInputFocused,
                        })}
                    >
                        Пароль
                    </label>
                    <div
                        onClick={handleTogglePassword}
                        className={classNames(styles.passShowBlock, {})}
                    >
                        <div className={styles.passShow}>
                            <Lottie
                                lottieRef={lottieRef}
                                autoplay={false}
                                animationData={showPass}
                                loop={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
/* eturn (
    <div>
      <div className={styles.inputContainer}>
        <div
          className={classNames(styles.inputBorder, {
            [styles.active]: isInputFocused,
            [styles.error]: ShowEmailError || error,
          })}
        />
        <input
          type="text"
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
          Электронная почта
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
      )}
    </div>
  ); */
