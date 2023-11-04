import { ISidebarRoute } from "src/app/routes/sidebarRoutes";
import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";
import { IconArrow } from "src/features/sidebar/assets/icons";

interface IProps {
    route: ISidebarRoute;
    collapsed?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    nestedMenuDrawerOpen?: boolean;
}

export const SidebarMenuItem = observer((props: IProps) => {
    const sidebarProps = props.route.sidebarProps;

    return (
        <NavLink
            to={props.route.path}
            className={({ isActive }) =>
                classNames(styles.menuItem, {
                    [styles.active]: isActive,
                    [styles.collapsed]: props.collapsed,
                })
            }
            onClick={props.onClick}
        >
            {sidebarProps?.icon && <div className={styles.itemIcon}>{sidebarProps?.icon}</div>}
            {!props.collapsed && (
                <>
                    {props.route.name}
                    {(sidebarProps?.counterValue ?? 0) > 0 && (
                        <div className={styles.counter}>{sidebarProps?.counterValue}</div>
                    )}
                    {props.route.children && (
                        <IconArrow
                            className={classNames(styles.arrow, {
                                [styles.rotated]: props.nestedMenuDrawerOpen,
                            })}
                        />
                    )}
                </>
            )}
        </NavLink>
    );
});
