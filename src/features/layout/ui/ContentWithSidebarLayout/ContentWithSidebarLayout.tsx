import styles from "./style.module.scss";
import { Sidebar } from "src/features/layout/ui/Sidebar/Sidebar";
import { Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

export const ContentWithSidebarLayout = observer(() => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <Outlet />
        </div>
    );
});
