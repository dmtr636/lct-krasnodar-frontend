import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";
import { useNavigate } from "react-router-dom";
import { IconChat, IconClose } from "src/shared/assets/img";
import { useState } from "react";
import { Drawer, TextareaAutosize } from "@mui/material";
import classNames from "classnames";
import { userStore } from "src/features/users/stores/userStore";
import { IMessage, mailingStore } from "src/features/mailing/stores/mailingStore";
import { HeaderActionButton } from "src/features/layout/ui/Header/HeaderActionButton/HeaderActionButton";
import { url } from "src/shared/helpers/url";

const tabs = ["Непрочитанные", "Прочитанные"];

export function download(url: string) {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() as string;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export const MessagesPage = observer(() => {
    const navigate = useNavigate();
    const [showingMessage, setShowingMessage] = useState<IMessage | null>(null);
    const [selectedTab, setSelectedTab] = useState(tabs[0]);

    return (
        <ContentWithHeaderLayout title={"Сообщения"} onBack={() => navigate("/")}>
            <div className={styles.content}>
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            className={classNames(styles.tab, {
                                [styles.active]: selectedTab === tab,
                            })}
                            onClick={() => setSelectedTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div className={styles.card}>
                    <div className={styles.programBlock}>
                        <div className={styles.courses}>
                            {mailingStore.messages
                                .filter((u) => (selectedTab === tabs[0] ? !u.isRead : u.isRead))
                                .filter((u) => u.userId === userStore.currentUser?.id)
                                .map((message) => (
                                    <button
                                        className={styles.course}
                                        onClick={() => {
                                            setShowingMessage(message);
                                            message.isRead = true;
                                            mailingStore.updateMessage(message);
                                        }}
                                    >
                                        <IconChat />
                                        {message.name}
                                        <div className={styles.actions}>
                                            {new Date(
                                                message.creationTimestamp,
                                            ).toLocaleDateString()}
                                        </div>
                                    </button>
                                ))}
                            {!mailingStore.messages
                                .filter((u) => u.userId === userStore.currentUser?.id)
                                .filter((u) => (selectedTab === tabs[0] ? !u.isRead : u.isRead))
                                .length && <div>Сообщения отсутствуют</div>}
                        </div>
                    </div>
                </div>
            </div>

            <Drawer open={!!showingMessage} anchor={"right"} elevation={0}>
                <div className={styles.drawer}>
                    <div className={styles.header}>
                        {showingMessage?.name}
                        <button className={styles.close} onClick={() => setShowingMessage(null)}>
                            <IconClose />
                        </button>
                    </div>
                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>Сообщение</div>
                        <TextareaAutosize
                            className={styles.textArea}
                            value={showingMessage?.text}
                            minRows={5}
                        />
                    </div>
                    {showingMessage?.file && (
                        <div className={styles.section}>
                            <div className={styles.row}>
                                <div>
                                    <div className={styles.sectionHeader}>Вложения</div>
                                    <HeaderActionButton
                                        onClick={() =>
                                            download(url(showingMessage.file?.url ?? ""))
                                        }
                                    >
                                        Скачать файл
                                    </HeaderActionButton>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Drawer>
        </ContentWithHeaderLayout>
    );
});
