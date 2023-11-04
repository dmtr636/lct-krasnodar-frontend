import React from "react";
import styles from "./LoginPage.module.scss";
import { LoginWindow } from "src/features/login/LoginWindow/LoginWindow";

export const LoginPage = () => {
    return (
        <div className={styles.body}>
            <LoginWindow />
        </div>
    );
};
