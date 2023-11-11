import { RouteObject } from "react-router-dom";
import { getSidebarRoutes, getSupportRoute } from "./sidebarRoutes";

import { AppContainer } from "src/app/containers/AppContainer";
import { LoginPage } from "src/pages/login/LoginPage/LoginPage";
import { ContentWithSidebarLayout } from "src/features/layout/ui/ContentWithSidebarLayout/ContentWithSidebarLayout";
import { UserPage } from "src/features/users/pages/UserPage/UserPage";

export const getRoutes = (): RouteObject[] => [
    {
        path: "/",
        element: <AppContainer />,
        children: [
            {
                path: "/",
                element: <ContentWithSidebarLayout />,
                children: [
                    ...getSidebarRoutes(),
                    getSupportRoute(),
                    {
                        path: "/users/:id",
                        element: <UserPage />,
                    },
                ],
            },
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
];
