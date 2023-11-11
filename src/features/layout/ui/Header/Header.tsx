import styles from "./style.module.scss";
import { IconArrow } from "src/features/layout/assets/icons";
import { ReactNode, useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { ButtonBack } from "src/shared/ui/Button/ButtonBack/ButtonBack";
import { userStore } from "src/features/users/stores/userStore";
import { IconButton } from "src/shared/ui/Button/IconButton/IconButton";
import { IconNotification, IconNotificationActive } from "src/shared/assets/img";
import { url } from "src/shared/helpers/url";
import { notificationsStore } from "src/features/notifications/stores/notificationStore";
import adminAvatar from "src/shared/assets/img/Admin.png";

export interface IHeaderProps {
    title: string;
    onBack?: () => void;
    startActions?: ReactNode[];
    endActions?: ReactNode[];
}

export const Header = observer((props: IHeaderProps) => {
    const navigate = useNavigate();
    const [profileMenuAnchorEl, setProfileMenuAnchorEl] = useState<any>(null);
    const [notificationMenuAnchorEl, setNotificationMenuAnchorEl] = useState<any>(null);
    const isProfileMenuOpen = Boolean(profileMenuAnchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setProfileMenuAnchorEl(event.currentTarget);
    };

    const handleCloseProfileMenu = () => {
        setProfileMenuAnchorEl(null);
    };

    const logout = async () => {
        navigate("/login");
        handleCloseProfileMenu();
        await userStore.logout();
    };

    const showSecondRow =
        !!props.onBack || !!props.startActions?.length || !!props.endActions?.length;

    return (
        <div className={styles.header}>
            <div className={classNames(styles.row, styles.first)}>
                <div className={styles.title}>{props.title}</div>
                <div className={styles.actions}>
                    <IconButton
                        onClick={(e) => {
                            setNotificationMenuAnchorEl(e.currentTarget);
                        }}
                        className={styles.notificationIcon}
                    >
                        {notificationsStore.notifications
                            .filter((n) => !n.isRead)
                            .filter((n) => n.userId === userStore.currentUser?.id).length ? (
                            <IconNotificationActive />
                        ) : (
                            <IconNotification />
                        )}
                    </IconButton>
                    <img
                        src={
                            userStore.currentUser?.photoFile?.url
                                ? url(userStore.currentUser?.photoFile?.url)
                                : adminAvatar
                        }
                        className={styles.avatar}
                    />
                    <IconButton onClick={handleClick}>
                        <IconArrow />
                    </IconButton>
                    <Menu
                        anchorEl={profileMenuAnchorEl}
                        open={isProfileMenuOpen}
                        onClose={handleCloseProfileMenu}
                        classes={{
                            paper: styles.menu,
                        }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                    >
                        {userStore.currentUser?.role !== "ADMIN" && (
                            <MenuItem
                                onClick={() => {
                                    handleCloseProfileMenu();
                                    navigate("/users/" + userStore.currentUser?.id);
                                }}
                                className={styles.menuItem}
                            >
                                Моя страница
                            </MenuItem>
                        )}
                        <MenuItem onClick={logout} className={styles.menuItem}>
                            Выход
                        </MenuItem>
                    </Menu>
                    <Menu
                        anchorEl={notificationMenuAnchorEl}
                        open={!!notificationMenuAnchorEl}
                        onClose={() => setNotificationMenuAnchorEl(null)}
                        classes={{
                            paper: styles.menu,
                        }}
                        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                        transformOrigin={{ horizontal: "right", vertical: "top" }}
                    >
                        {!notificationsStore.notifications
                            .filter((n) => !n.isRead)
                            .filter((n) => n.userId === userStore.currentUser?.id).length && (
                            <MenuItem
                                onClick={() => {
                                    setNotificationMenuAnchorEl(false);
                                }}
                                className={classNames(styles.menuItem, styles.empty)}
                            >
                                Уведомлений нет
                            </MenuItem>
                        )}
                        {notificationsStore.notifications
                            .filter((n) => !n.isRead)
                            .filter((n) => n.userId === userStore.currentUser?.id)
                            .map((n) => [
                                <div className={styles.divider}></div>,
                                <MenuItem
                                    onClick={() => {
                                        n.isRead = true;
                                        notificationsStore.updateNotification(n);
                                        setNotificationMenuAnchorEl(false);
                                        navigate(n.url);
                                    }}
                                    className={styles.menuItem}
                                >
                                    {n.text}
                                </MenuItem>,
                            ])}
                    </Menu>
                </div>
            </div>
            {showSecondRow && (
                <div className={classNames(styles.row, styles.second)}>
                    {props.onBack && <ButtonBack onClick={props.onBack}>Назад</ButtonBack>}
                    {props.startActions}
                    <div className={styles.endActions}>{props.endActions}</div>
                </div>
            )}
        </div>
    );
});
