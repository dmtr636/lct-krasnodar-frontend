import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { IconClose, IconTriangle } from "src/features/sidebar/assets/icons";
import { ISidebarRoute } from "src/app/routes/sidebarRoutes";
import { NavLink } from "react-router-dom";

interface IProps {
    routes: ISidebarRoute[];
    onClose: () => void;
}

export const SidebarNestedMenuDrawer = observer((props: IProps) => {
    return (
        <div
            className={classNames(styles.drawer, {
                [styles.open]: props.routes.length,
            })}
        >
            <button className={styles.closeButton} onClick={props.onClose}>
                <IconClose />
            </button>
            <div className={styles.menu}>
                {props.routes.map((route) => (
                    <NavLink
                        to={route.path}
                        className={({ isActive }) =>
                            classNames(styles.menuItem, {
                                [styles.active]: isActive,
                            })
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {route.name}
                                {isActive && <IconTriangle className={styles.triangle} />}
                            </>
                        )}
                    </NavLink>
                ))}
            </div>
        </div>
    );
});
