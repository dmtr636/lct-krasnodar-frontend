import { Outlet } from "react-router-dom";
import Sidebar from "src/features/layout/ui/Sidebar/Sidebar";
import styles from "./style.module.scss";
import Header from "src/features/layout/ui/Header/Header";

const AdminPageLayout = () => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div>
                <Header />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminPageLayout;
