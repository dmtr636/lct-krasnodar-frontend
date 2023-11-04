import styles from "./style.module.scss";
import { ISidebarRoute, sidebarRoutes } from "src/app/routes/sidebarRoutes";
import { SidebarMenuItem } from "../SidebarMenuItem/SidebarMenuItem";
import { observer } from "mobx-react-lite";
import { logo } from "../../assets/icons";
import React, { useRef, useState } from "react";
import classNames from "classnames";
import { SidebarNestedMenuDrawer } from "src/features/sidebar/ui/SidebarNestedMenuDrawer/SidebarNestedMenuDrawer";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { collapseAnimation } from "src/features/sidebar/assets/animations";
import {Button} from "src/shared/ui/Button/Button";
import {userStore} from "src/features/login/store/userStore";
import {useNavigate} from "react-router-dom";

const Sidebar = observer(() => {
    const [collapsed, setCollapsed] = useState(false);
    const [drawerRoutes, setDrawerRoutes] = useState<ISidebarRoute[]>([]);
    const collapseIconRef = useRef<LottieRefCurrentProps>(null);
    const navigate = useNavigate();

    const handleSidebarMenuItemClick = (
        event: React.MouseEvent<HTMLElement>,
        route: ISidebarRoute,
    ) => {
        if (route.children) {
            event.preventDefault();
        }
        if (route.children === drawerRoutes) {
            setDrawerRoutes([]);
        } else {
            setDrawerRoutes(route.children ?? []);
        }
    };

    const toggleSidebar = () => {
        const collapseIcon = collapseIconRef.current;
        collapseIcon?.setDirection(collapsed ? -1 : 1);
        collapseIcon?.play();
        setCollapsed(!collapsed);
    };

    return (
        <div className={styles.sidebarContainer}>
            <div
                className={classNames(styles.sidebar, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <div
                    className={classNames(styles.header, {
                        [styles.collapsed]: collapsed,
                    })}
                >
                    {!collapsed && <img src={logo} className={styles.logo} alt={""} />}
                    <button
                        className={classNames(styles.toggleButton, {
                            [styles.collapsed]: collapsed,
                        })}
                        onClick={toggleSidebar}
                    >
                        <Lottie
                            lottieRef={collapseIconRef}
                            animationData={collapseAnimation}
                            loop={false}
                            autoplay={false}
                        />
                    </button>
                </div>
                <div className={styles.menu}>
                    {sidebarRoutes.map((route) => (
                        <SidebarMenuItem
                            route={route}
                            collapsed={collapsed}
                            onClick={(event) => handleSidebarMenuItemClick(event, route)}
                            nestedMenuDrawerOpen={route.children === drawerRoutes}
                            key={route.path}
                        />
                    ))}
                </div>
                <div className={styles.logoutButton}>
                    <Button
                        onClick={async () => {
                            await userStore.logout();
                            navigate("/login");
                        }}
                        isLoading={false}
                        disabled={false}
                    >
                        Выход
                    </Button>
                </div>
            </div>
            <SidebarNestedMenuDrawer routes={drawerRoutes} onClose={() => setDrawerRoutes([])} />
        </div>
    );
});

export default Sidebar;
