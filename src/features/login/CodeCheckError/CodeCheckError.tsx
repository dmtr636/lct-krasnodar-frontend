import React from "react";
import styles from "./CodeCheckError.module.scss";
import { Alert } from "src/shared/ui/Alert/Alert";

export const CodeCheckError = ({
    errorCount,
    setIsError,
}: {
    errorCount: number;
    setIsError: (arg: boolean) => void;
}) => {
    return (
        <>
            {errorCount == 0 || undefined ? (
                <button className={styles.callSupp}>Обратиться в службу поддержки</button>
            ) : (
                <Alert setIsError={setIsError}>
                    <div className={styles.text}>
                        Код неверный.
                        {errorCount <= 3 && (
                            <>
                                {errorCount == 1
                                    ? ` Осталась ${errorCount} попытка`
                                    : ` Осталось ${errorCount} попытки`}
                            </>
                        )}
                    </div>
                </Alert>
            )}
        </>
    );
};
