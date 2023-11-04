import { ISidebarRoute } from "src/app/routes/sidebarRoutes";
import React from "react";
import { NavLink } from "react-router-dom";
import classNames from "classnames";
import styles from "./style.module.scss";
import { observer } from "mobx-react-lite";

interface IProps {
    route: ISidebarRoute;
    collapsed?: boolean;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
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
                </>
            )}
        </NavLink>
    );
});
