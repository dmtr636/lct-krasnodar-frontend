import styles from "./style.module.scss";
import { Sidebar } from "src/features/layout/ui/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";

export const ContentWithSidebarLayout = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <Outlet />
        </div>
    );
};
