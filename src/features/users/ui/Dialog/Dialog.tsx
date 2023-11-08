import { Modal } from "@mui/material";
import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ReactNode } from "react";

export const Dialog = observer(
    (props: {
        open: boolean;
        title: string;
        titleIcon?: ReactNode;
        description?: string;
        onClose: () => void;
        onCancel?: () => void;
        onDelete?: () => void;
        cancelButtonText?: string;
        deleteButtonText?: string;
    }) => {
        return (
            <Modal open={props.open} onClose={props.onClose} className={styles.modal}>
                <div className={styles.card}>
                    <div className={styles.header}>
                        {props.titleIcon}
                        {props.title}
                    </div>
                    {props.description && (
                        <div className={styles.description}>{props.description}</div>
                    )}
                    <div className={styles.actions}>
                        {props.onCancel && (
                            <button className={styles.cancelButton} onClick={props.onCancel}>
                                {props.cancelButtonText ?? "Отмена"}
                            </button>
                        )}
                        {props.onDelete && (
                            <button className={styles.deleteButton} onClick={props.onDelete}>
                                {props.deleteButtonText ?? "Удалить"}
                            </button>
                        )}
                    </div>
                </div>
            </Modal>
        );
    },
);
