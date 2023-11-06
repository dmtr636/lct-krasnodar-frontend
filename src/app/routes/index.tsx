import { RouteObject } from "react-router-dom";
import { sidebarRoutes, supportRoute } from "./sidebarRoutes";

import { AppContainer } from "src/app/containers/AppContainer";
import AdminPageLayout from "src/features/layout/ui/AdminPageLayout/AdminPageLayout";
import { LoginPage } from "src/pages/login/LoginPage/LoginPage";
import { RecoveryPage } from "src/pages/login/RecoveryPage/RecoveryPage";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <AppContainer />,
        children: [
            {
                path: "/",
                element: <AdminPageLayout />,
                children: [...sidebarRoutes, supportRoute],
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
            {
                path: "/recovery",
                element: <RecoveryPage />,
            },
        ],
    },
];
