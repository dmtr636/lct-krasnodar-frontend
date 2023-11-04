import React, { useState } from "react";
import styles from "./RecoveryPage.module.scss";
import { RecoveryPassword } from "src/features/login/RecoveryPassword/RecoveryPassword";
import { CodeCheck } from "src/features/login/CodeCheck/CodeCheck";
import { ChangePassword } from "src/features/login/ChangePassword/ChangePassword";
import { SuccesfullChangePassword } from "src/features/login/SuccesfullChangePassword/SuccesfullChangePassword";

export const RecoveryPage = () => {
    const [step, setStep] = useState(1);
    const [inputEmailValue, setEmailInputValue] = React.useState("");
    const [inputCodeValue, setInputCodeValue] = React.useState("");

    return (
        <div className={styles.body}>
            {step === 1 ? (
                <RecoveryPassword
                    setStep={setStep}
                    setEmailInputValue={setEmailInputValue}
                    inputEmailValue={inputEmailValue}
                />
            ) : (
                <></>
            )}
            {step === 2 ? (
                <CodeCheck
                    setStep={setStep}
                    email={inputEmailValue}
                    setInputCodeValue={setInputCodeValue}
                    inputCodeValue={inputCodeValue}
                />
            ) : (
                <></>
            )}
            {step === 3 ? (
                <ChangePassword
                    setStep={setStep}
                    inputEmailValue={inputEmailValue}
                    inputCodeValue={inputCodeValue}
                />
            ) : (
                <></>
            )}
            {step === 4 ? <SuccesfullChangePassword /> : <></>}
        </div>
    );
};
