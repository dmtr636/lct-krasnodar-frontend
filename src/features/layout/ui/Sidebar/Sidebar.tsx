import styles from "./style.module.scss";
import { getSidebarRoutes, getSupportRoute } from "src/app/routes/sidebarRoutes";
import { SidebarMenuItem } from "../SidebarMenuItem/SidebarMenuItem";
import { observer } from "mobx-react-lite";
import { sidebarLogo } from "../../assets/icons";
import { useRef, useState } from "react";
import classNames from "classnames";
import Lottie, { LottieRefCurrentProps } from "lottie-react";
import { collapseAnimation } from "../../assets/animations";

export const Sidebar = observer(() => {
    const [collapsed, setCollapsed] = useState(false);
    const collapseIconRef = useRef<LottieRefCurrentProps>(null);

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
                    {!collapsed && <img src={sidebarLogo} className={styles.logo} alt={""} />}
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
                    {getSidebarRoutes().map((route) => (
                        <SidebarMenuItem route={route} collapsed={collapsed} key={route.path} />
                    ))}
                </div>
                <div className={styles.footer}>
                    <SidebarMenuItem route={getSupportRoute()} collapsed={collapsed} />
                </div>
            </div>
        </div>
    );
});
