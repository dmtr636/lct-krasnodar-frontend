/* import React from "react";
 */ import styles from "./LoginPage.module.scss";
import { LoginWindow } from "src/features/login/LoginWindow/LoginWindow";
import LogoProscom from "src/shared/assets/img/LogoProscom.svg";

export const LoginPage = () => {
    return (
        <div className={styles.body}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <img src={LogoProscom} alt="" />
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.loginWindow}>
                    <LoginWindow />
                </div>
            </div>
        </div>
    );
};
