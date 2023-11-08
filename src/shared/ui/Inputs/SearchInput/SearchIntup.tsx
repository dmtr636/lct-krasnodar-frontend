import React, { ChangeEvent, useState } from "react";
import classNames from "classnames";
import styles from "./SearchInput.module.scss";
import search from "./Search.svg";
import close from "src/shared/assets/img/Close.svg";
export const SearchInput = ({
    onChange,
    inputValue,
    placeholder,
}: {
    onChange: (value: string) => void;
    inputValue: string;
    placeholder?: string;
}) => {
    const [isInputFocused, setIsInputFocused] = useState(false);

    /*     const [firstFocus, setfirstFocus] = useState(false);
     */
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onChange(event.target.value);
    };

    const handleInputFocus = (): void => {
        setIsInputFocused(true);
        /*         setfirstFocus(true);
         */
    };

    const handleInputBlur = (): void => {
        setIsInputFocused(false);
    };

    return (
        <div className={styles.inputContainer}>
            <div
                className={classNames(styles.inputBorder, {
                    [styles.active]: isInputFocused,
                })}
            />
            <img className={styles.search} src={search} alt="" />
            <input
                type="text"
                value={inputValue}
                className={styles.input}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                placeholder={placeholder ?? "ФИО сотрудника"}
            />
            <label
                className={classNames(styles.inputLabel, {
                    [styles.active]: true /* : isInputFocused || inputValue !== "" */,
                })}
            >
                Поиск
            </label>
            {inputValue.length >= 1 && (
                <div className={styles.close} onClick={() => onChange("")}>
                    <img className={styles.iconClose} src={close} />
                </div>
            )}
        </div>
    );
};
