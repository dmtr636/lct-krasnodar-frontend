import React, { ReactNode } from "react";
import styles from "./ContentContainer.module.scss";
export const ContentContainer = ({ children, text }: { children: ReactNode; text: string }) => {
    return (
        <div className={styles.container}>
            <div className={styles.headerText}>{text}</div>
            {children}
        </div>
    );
};
