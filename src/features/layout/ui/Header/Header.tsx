import styles from "./style.module.scss";
import { IconArrow } from "src/features/layout/assets/icons";
import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import { userStore } from "src/features/login/store/userStore";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        handleClose();
        await userStore.logout();
        navigate("/login");
    };

    return (
        <div className={styles.header}>
            <img
                src={
                    "https://images.unsplash.com/photo-1579168765467-3b235f938439?auto=format&fit=crop&q=80&w=96&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                className={styles.avatar}
            />
            <button className={styles.arrowButton} onClick={handleClick}>
                <IconArrow />
            </button>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={logout}>Выход</MenuItem>
            </Menu>
        </div>
    );
};

export default Header;