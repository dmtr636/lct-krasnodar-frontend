import { ReactNode } from "react";
import styles from "./styles.module.scss";

export const HomeContainer = ({ children, header }: { children: ReactNode; header: string }) => {
    return (
        <div className={styles.container}>
            <div className={styles.containerHead}>{header}</div>
            {children}
        </div>
    );
};
