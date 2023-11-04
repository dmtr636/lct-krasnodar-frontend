import React, { useState } from "react";
import styles from "./LoginWindow.module.scss";

import axios from "axios";
import { observer } from "mobx-react-lite";

import { LoginError } from "../LoginError/LoginError";
import { useNavigate } from "react-router-dom";
import { LOGIN_ENDPOINT } from "src/shared/api/endpoints";
import { EmailInput } from "src/shared/ui/Inputs/EmailInput/EmailInput";
import { PasswordInput } from "src/shared/ui/Inputs/PasswordInput/PasswordInput";
import { Checkbox } from "src/shared/ui/Checkbox/Checkbox";
import { Button } from "src/shared/ui/Button/Button";
import { userStore } from "../store/userStore";
import { ContentContainer } from "src/shared/ui/ContentContainer/ContentContainer";
import { Alert } from "src/shared/ui/Alert/Alert";

export const LoginWindow = observer(() => {
    const [emailInputValue, setEmailInputValue] = useState("");
    const [passwordInputValue, setPasswordInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [emailIsValid, setEmailIsValidated] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorCount, setErrorCount] = useState(6);
    const [blockTimeCount, setBlockTimeCount] = useState(0);
    const [blockButtonTimeout, setBlockButtonTimeout] = useState(false);

    const checkboxChange = () => {
        setIsChecked(!isChecked);
    };

    const data = {
        email: emailInputValue,
        password: passwordInputValue,
        rememberMe: isChecked,
    };
    const blockButton = (blockTimeCount: number) => {
        console.log("хай");
        setBlockButtonTimeout(true);
        setTimeout(() => {
            setBlockButtonTimeout(false);
            setErrorCount(6);
        }, blockTimeCount /* * 60 * 1000 */); /* Поставить нужные значения потом!! */
    };
    const sendLogpass = () => {
        setIsLoading(true);

        axios
            .post(LOGIN_ENDPOINT, data)
            .then((response) => {
                setIsError(false);
                userStore.setUser(response.data);
                navigate("/");
                setIsLoading(false);
                setErrorCount(6);
            })
            .catch((error) => {
                setIsLoading(false);
                setIsError(true);
                setErrorCount(error.response.data.error.data.attempts_left);
                console.log(error.response.data.error.data.attempts_left);
                if (error.response.data.error.data?.ban_duration_seconds) {
                    setBlockTimeCount(error.response.data.error.data?.ban_duration_seconds);
                    blockButton(error.response.data.error.data?.ban_duration_seconds);
                }
            });
    };
    console.log(errorCount);
    const navigate = useNavigate();
    return (
        <ContentContainer text="Вход в кабинет">
            <div className={styles.inputBlock}>
                <EmailInput
                    error={isError}
                    onChange={setEmailInputValue}
                    inputValue={emailInputValue}
                    setEmailIsValidated={setEmailIsValidated}
                />
                <PasswordInput
                    onChange={setPasswordInputValue}
                    error={isError}
                    inputValue={passwordInputValue}
                />
            </div>
            <div className={styles.rememberMe}>
                <Checkbox checkboxChange={checkboxChange} isChecked={isChecked}>
                    Запомнить меня
                </Checkbox>
            </div>

            <div className={styles.footerBlock}>
                {isError ? (
                    <LoginError
                        errorCount={errorCount}
                        setIsError={setIsError}
                        blockTimeCount={blockTimeCount}
                    />
                ) : (
                    <></>
                )}
                <div className={styles.buttonBlock}>
                    <div className={styles.button}>
                        <Button
                            onClick={() => sendLogpass()}
                            disabled={!emailIsValid || !passwordInputValue || blockButtonTimeout}
                            isLoading={isLoading}
                        >
                            Войти
                        </Button>
                    </div>
                    <div onClick={() => navigate("/recovery")} className={styles.passwordRecovery}>
                        Не могу войти
                    </div>
                </div>
            </div>
        </ContentContainer>
    );
});
