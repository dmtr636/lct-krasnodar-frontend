import styles from "./styles.module.scss";
import close from "src/shared/assets/img/Close.svg";
import Lottie from "lottie-react";
import success from "src/shared/assets/animation/success.json";
import { Button } from "src/shared/ui/Button/Button";

export const ShowSuccefullEdit = ({
    setShowSuccefull,
}: {
    setShowSuccefull: (arg: boolean) => void;
}) => {
    return (
        <div className={styles.container} onClick={() => setShowSuccefull(false)}>
            <div className={styles.content}>
                <div className={styles.header}>
                    {" "}
                    Добавление сотрудника{" "}
                    <div className={styles.close}>
                        {" "}
                        <img src={close} alt="" />
                    </div>
                </div>
                <div className={styles.contentContainer}>
                    <div className={styles.contentAnimation}>
                        <Lottie animationData={success} loop={false} />
                    </div>
                    <div className={styles.contentText}>
                        Сотрудник успешно добавлен <br />
                        Пароль для доступа был отправлен <br /> на указанную почту
                    </div>
                </div>
                <div className={styles.button}>
                    <Button
                        isLoading={false}
                        disabled={false}
                        onClick={() => setShowSuccefull(false)}
                    >
                        Добавить ещё
                    </Button>
                </div>
            </div>
        </div>
    );
};
