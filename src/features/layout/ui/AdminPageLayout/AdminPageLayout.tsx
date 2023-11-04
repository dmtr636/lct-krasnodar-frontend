import { Outlet } from "react-router-dom";
import Sidebar from "src/features/sidebar/ui/Sidebar/Sidebar";
import styles from "./style.module.scss";

const AdminPageLayout = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <Outlet />
        </div>
    );
};

export default AdminPageLayout;
