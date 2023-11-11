/* import React from "react";
 */ import styles from "./LoginPage.module.scss";
import { LoginWindow } from "src/features/login/LoginWindow/LoginWindow";
import LogoProscom from "src/shared/assets/img/LogoProscom.svg";
import bgleft from "./bgLeft.png";
import bgright from "./bg2.png";

export const LoginPage = () => {
    return (
        <div className={styles.body}>
            <div className={styles.left}>
                <div className={styles.logo}>
                    <img src={LogoProscom} alt="" />
                </div>
                <div className={styles.bg}>
                    <div className={styles.bgLeft}>
                        <img className={styles.bgLeftImg} src={bgleft} alt="" />
                    </div>
                    <div className={styles.bgRight}>
                        <img className={styles.bgRightImg} src={bgright} alt="" />
                    </div>
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
