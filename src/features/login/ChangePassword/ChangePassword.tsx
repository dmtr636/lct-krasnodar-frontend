import React, { useState } from "react";
import styles from "./ChangePassword.module.scss";

import { ReactComponent as CheckMark } from "../../../shared/assets/img/Checkmark.svg";

import classNames from "classnames";
import axios from "axios";
import { CHANGE_PASSWORD } from "src/shared/api/endpoints";
import { PasswordInput } from "src/shared/ui/Inputs/PasswordInput/PasswordInput";
import { Button } from "src/shared/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { ButtonBack } from "src/shared/ui/Button/ButtonBack/ButtonBack";
import { ContentContainer } from "src/shared/ui/ContentContainer/ContentContainer";

export const ChangePassword = ({
    setStep,
    inputEmailValue,
    inputCodeValue,
}: {
    setStep: (arg: number) => void;
    inputEmailValue: string;
    inputCodeValue: string;
}) => {
    const [inputValue, setInputValue] = React.useState("");
    const [isLoading, setIsLoading] = useState(false);

    const haveANumberRegex = /\d/;
    const haveANumber = haveANumberRegex.test(inputValue);

    const haveAbigCharrRegex = /[A-Z]/;
    const haveAbigChar = haveAbigCharrRegex.test(inputValue);

    const generatePassword = () => {
        const lowercaseLetters = "abcdefghijkmnpqrstuvwxyz";
        const uppercaseLetters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
        const numbers = "123456789";

        const getRandomCharacter = (characters: string) => {
            const values = new Uint32Array(1);
            crypto.getRandomValues(values);
            const randomIndex = values[0] % characters.length;
            return characters[randomIndex];
        };

        const shuffleString = (str: string) => {
            const shuffledArray = Array.from(str);
            for (let i = shuffledArray.length - 1; i > 0; i--) {
                const jValues = new Uint32Array(1);
                crypto.getRandomValues(jValues);
                const j = jValues[0] % (i + 1);
                [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
            }
            return shuffledArray.join("");
        };

        let generatedPassword = "";
        generatedPassword += getRandomCharacter(lowercaseLetters);
        generatedPassword += getRandomCharacter(uppercaseLetters);
        generatedPassword += getRandomCharacter(numbers);

        const remainingLength = 10 - generatedPassword.length;
        const allCharacters = lowercaseLetters + uppercaseLetters + numbers;
        for (let i = 0; i < remainingLength; i++) {
            generatedPassword += getRandomCharacter(allCharacters);
        }

        generatedPassword = shuffleString(generatedPassword);
        setInputValue(generatedPassword);
    };
    const data = {
        email: inputEmailValue,
        code: inputCodeValue,
        new_password: inputValue,
    };
    const sendNewPass = () => {
        setIsLoading(true);
        /*         console.log("отправка данных " + data);
         */ axios
            .post(CHANGE_PASSWORD, data)
            .then((response) => {
                setIsLoading(false);
                setStep(4);
            })
            .catch((error) => {
                setIsLoading(false);
                /*                 console.log("ошибка" + error);
                 */
            });
    };
    const navigate = useNavigate();
    return (
        <ContentContainer text="Восстановление пароля">
            <div className={styles.inputContainer}>
                <PasswordInput onChange={setInputValue} inputValue={inputValue} error={false} />
            </div>
            <div className={styles.checkBlock}>
                <div
                    className={classNames(styles.checkBlockItem, {
                        [styles.active]: inputValue.length >= 8,
                    })}
                >
                    <CheckMark />
                    Содержит 8 символов
                </div>
                <div
                    className={classNames(styles.checkBlockItem, {
                        [styles.active]: haveAbigChar,
                    })}
                >
                    <CheckMark />
                    Есть заглавная буква
                </div>
                <div
                    className={classNames(styles.checkBlockItem, {
                        [styles.active]: haveANumber,
                    })}
                >
                    <CheckMark />
                    Имеется одна цифра
                </div>
            </div>
            <button className={styles.passwordGenerator} onClick={() => generatePassword()}>
                Сгенерировать автоматически
            </button>
            <div className={styles.buttonsBlock}>
                <ButtonBack onClick={() => navigate("/login")} />
                <div className={styles.buttonSend}>
                    <Button
                        isLoading={isLoading}
                        onClick={() => sendNewPass()}
                        disabled={!(haveANumber && haveAbigChar && inputValue.length >= 8)}
                    >
                        Установить пароль
                    </Button>
                </div>
            </div>
        </ContentContainer>
    );
};
