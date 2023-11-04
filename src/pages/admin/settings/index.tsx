import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet } from "react-router-dom";

export const SettingsPage = observer(() => {
    return (
        <div>
            <h1>Настройки</h1>
            <Outlet />
        </div>
    );
});
