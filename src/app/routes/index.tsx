import { RouteObject } from "react-router-dom";
import { sidebarRoutes, supportRoute } from "./sidebarRoutes";

import { AppContainer } from "src/app/containers/AppContainer";
import { LoginPage } from "src/pages/login/LoginPage/LoginPage";
import { RecoveryPage } from "src/pages/login/RecoveryPage/RecoveryPage";
import { ContentWithSidebarLayout } from "src/features/layout/ui/ContentWithSidebarLayout/ContentWithSidebarLayout";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <AppContainer />,
        children: [
            {
                path: "/",
                element: <ContentWithSidebarLayout />,
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
