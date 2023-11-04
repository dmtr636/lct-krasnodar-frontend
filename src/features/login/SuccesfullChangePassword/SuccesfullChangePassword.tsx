import React from "react";
import Lottie from "lottie-react";
import styles from "./SuccesfullChangePassword.module.scss";

import { useNavigate } from "react-router-dom";
import success from "../../../shared/assets/animation/success.json";
import { Button } from "src/shared/ui/Button/Button";
export const SuccesfullChangePassword = () => {
    const navigate = useNavigate();
    return (
        <div className={styles.body}>
            <div className={styles.content}>
                <div className={styles.contentAnimation}>
                    <Lottie animationData={success} loop={false} />
                </div>
                <div className={styles.contentText}>Пароль успешно установлен</div>
            </div>
            <div className={styles.buttonBlock}>
                <Button disabled={false} isLoading={false} onClick={() => navigate("/login")}>
                    Перейти к авторизации
                </Button>
            </div>
        </div>
    );
};
