/* import React from "react";
 */ import styles from "./LoginError.module.scss";

import { Alert } from "src/shared/ui/Alert/Alert";

export const LoginError = ({
    errorCount,
    setIsError,
    blockTimeCount,
}: {
    errorCount: number;
    setIsError: (arg: boolean) => void;
    blockTimeCount: number;
}) => {
    function getMinutesWord(minutes: number) {
        const lastDigit = minutes % 10;
        const lastTwoDigits = minutes % 100;

        if (lastDigit === 1 && lastTwoDigits !== 11) {
            return "минута";
        } else if ([2, 3, 4].includes(lastDigit) && ![12, 13, 14].includes(lastTwoDigits)) {
            return "минуты";
        } else {
            return "минут";
        }
    }
    return (
        <Alert setIsError={setIsError}>
            {blockTimeCount !== 0 ? (
                <>
                    Попробуйте повторить позже <br /> Блокировка: {Math.ceil(blockTimeCount / 60)}{" "}
                    {getMinutesWord(Math.ceil(blockTimeCount / 60))}
                </>
            ) : (
                <>
                    Неправильная почта или пароль
                    <div className={styles.errorText}>
                        {errorCount <= 3 &&
                            (errorCount == 1
                                ? `\nОсталась ${errorCount} попытка`
                                : `\nОсталось ${errorCount} попытки`)}
                    </div>
                </>
            )}
        </Alert>
    );
};
