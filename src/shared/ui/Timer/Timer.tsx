import { useState, useEffect } from "react";
import styles from "./Timer.module.scss";

const Timer = ({
    setDisabledButton,
    setShowTimer,
}: {
    setDisabledButton: (arg: boolean) => void;
    setShowTimer: (arg: boolean) => void;
}) => {
    const [seconds, setSeconds] = useState(60);

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prevSeconds) => prevSeconds - 1);
            }, 1000);

            return () => {
                clearInterval(timer);
            };
        } else {
            setDisabledButton(false);
            setShowTimer(false);
        }
    }, [seconds]);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
            .toString()
            .padStart(2, "0");
        const seconds = (time % 60).toString().padStart(2, "0");
        return `${minutes}:${seconds}`;
    };
    return (
        <div className={styles.timer}>
            {seconds > 0 && <div className={styles.timer}>{formatTime(seconds)}</div>}
        </div>
    );
};

export default Timer;
