import React from "react";
import { Alert } from "src/shared/ui/Alert/Alert";

export const RecoveryError = ({ setIsError }: { setIsError: (arg: boolean) => void }) => {
    return (
        <Alert setIsError={setIsError}>
            Эта почта не зарегистрирована <br /> Проверьте указанную почту
        </Alert>
    );
};
