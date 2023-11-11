import React, { useState } from "react";
import styles from "./CodeCheck.module.scss";

import axios from "axios";
import classNames from "classnames";
import RICIBs from "react-individual-character-input-boxes";

import { CodeCheckError } from "../CodeCheckError/CodeCheckError";
import { CHECK_CODE, SEND_CODE } from "src/shared/api/endpoints";
import Timer from "src/shared/ui/Timer/Timer";
import { Button } from "src/shared/ui/Button/Button";
import { ButtonBack } from "src/shared/ui/Button/ButtonBack/ButtonBack";
import { ContentContainer } from "src/shared/ui/ContentContainer/ContentContainer";

export const CodeCheck = ({
    setStep,
    email,
    setInputCodeValue,
    inputCodeValue,
}: {
    setStep: (arg: number) => void;

    setInputCodeValue: (arg: string) => void;
    email: string;
    inputCodeValue: string;
}) => {
    const [isError, setIsError] = React.useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorCount, setErrorCount] = useState(4);
    const [disabledButton, setDisabledButton] = useState(true);

    const [showTimer, setShowTimer] = useState(true);

    const sendCode = () => {
        setIsLoading(true);
        axios
            .post(CHECK_CODE, data)
            .then((response) => {
                setIsError(false);
                setIsLoading(false);
                setStep(3);
            })
            .catch((error) => {
                setIsLoading(false);
                setIsError(true);
                setErrorCount(error.response.data.error.data.enter_attempts_left);
            });
    };
    const sendEmail = () => {
        setDisabledButton(true);
        setShowTimer(true);
        axios
            .post(SEND_CODE, emailData)
            .then((response) => {
                setShowTimer(true);
            })
            .catch((error) => {});
    };
    const handleOutputString = (string: string) => {
        setInputCodeValue(string);
    };
    const emailData = { email: email };
    const data = { email: email, code: inputCodeValue };

    return (
        <ContentContainer text="Восстановление пароля">
            <div className={styles.text}>Мы отправили код на указанную почту</div>
            <div className={styles.inputContainer}>
                <RICIBs
                    amount={4}
                    handleOutputString={handleOutputString}
                    inputRegExp={/^[0-9]$/}
                    inputProps={[
                        {
                            placeholder: " ",
                            className: classNames(styles.firstInput, {
                                [styles.error]: isError,
                            }),
                        },
                        {
                            placeholder: " ",
                            className: classNames(styles.input, { [styles.error]: isError }),
                        },
                        {
                            placeholder: " ",
                            className: classNames(styles.input, { [styles.error]: isError }),
                        },
                        {
                            placeholder: " ",
                            className: classNames(styles.input, { [styles.error]: isError }),
                        },
                    ]}
                />
            </div>
            <div className={styles.timerContainer}>
                {showTimer && (
                    <Timer setDisabledButton={setDisabledButton} setShowTimer={setShowTimer} />
                )}

                <button
                    disabled={disabledButton || errorCount == 0}
                    onClick={() => sendEmail()}
                    className={styles.timerButton}
                >
                    Отправить ещё раз
                </button>
            </div>
            <div className={styles.errorBlock}>
                {isError && (
                    <CodeCheckError
                        errorCount={errorCount}
                        setIsError={setIsError}
                    ></CodeCheckError>
                )}
            </div>

            <div className={styles.buttonsBlock}>
                <ButtonBack isDisabled={disabledButton} onClick={() => setStep(1)} />
                <div className={styles.buttonSend}>
                    <Button
                        isLoading={isLoading}
                        onClick={() => sendCode()}
                        disabled={inputCodeValue.length !== 4 || errorCount == 0}
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </ContentContainer>
    );
};
