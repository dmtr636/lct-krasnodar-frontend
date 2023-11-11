import React, { useState } from "react";
import styles from "./RecoveryPassword.module.scss";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RecoveryError } from "../RecoveryError/RecoveryError";
import { SEND_CODE } from "src/shared/api/endpoints";
import { EmailInput } from "src/shared/ui/Inputs/EmailInput/EmailInput";
import { Button } from "src/shared/ui/Button/Button";
import { ButtonBack } from "src/shared/ui/Button/ButtonBack/ButtonBack";
import { ContentContainer } from "src/shared/ui/ContentContainer/ContentContainer";

export const RecoveryPassword = ({
    setStep,
    setEmailInputValue,
    inputEmailValue,
}: {
    setStep: (arg: number) => void;
    setEmailInputValue: (arg: string) => void;
    inputEmailValue: string;
}) => {
    const [isError, setIsError] = React.useState(false);
    const [emailIsValid, setEmailIsValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const data = { email: inputEmailValue };
    const sendEmail = () => {
        setIsLoading(true);
        axios
            .post(SEND_CODE, data)
            .then((response) => {
                setIsError(false);
                setIsLoading(false);
                setStep(2);
            })
            .catch((error) => {
                setIsLoading(false);
                setIsError(true);
            });
    };
    React.useEffect(() => {
        if (inputEmailValue) setEmailIsValidated(true);
    }, []);
    return (
        <ContentContainer text="Восстановление пароля">
            <div className={styles.headerSubText}>Укажите адрес вашей электронной почты</div>
            <div className={styles.emailBlock}>
                <EmailInput
                    onChange={setEmailInputValue}
                    inputValue={inputEmailValue}
                    setEmailIsValidated={setEmailIsValidated}
                    error={isError}
                />
            </div>
            <div className={styles.errorBlock}>
                {isError && <RecoveryError setIsError={setIsError} />}
            </div>
            <div className={styles.buttonsBlock}>
                <ButtonBack onClick={() => navigate("/login")} />
                <div className={styles.buttonSend}>
                    <Button
                        isLoading={isLoading}
                        onClick={() => sendEmail()}
                        disabled={!emailIsValid}
                    >
                        Далее
                    </Button>
                </div>
            </div>
        </ContentContainer>
    );
};
