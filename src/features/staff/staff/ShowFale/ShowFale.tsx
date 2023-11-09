import styles from "./styles.module.scss";
import close from "src/shared/assets/img/Close.svg";
import Lottie from "lottie-react";
import closeAnimation from "src/shared/assets/animation/close_start.json";
import { Button } from "src/shared/ui/Button/Button";

export const ShowFale = ({ setShowFale }: { setShowFale: (arg: boolean) => void }) => {
    return (
        <div className={styles.container} onClick={() => setShowFale(false)}>
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
                        <Lottie animationData={closeAnimation} loop={false} />
                    </div>
                    <div className={styles.contentText}>
                        Произошла ошибка <br />
                        Сотрудник не был добавлен <br /> Попробуйте ещё раз
                    </div>
                </div>
                <div className={styles.button}>
                    <Button isLoading={false} disabled={false} onClick={() => setShowFale(false)}>
                        Добавить сотрудника
                    </Button>
                </div>
            </div>
        </div>
    );
};
