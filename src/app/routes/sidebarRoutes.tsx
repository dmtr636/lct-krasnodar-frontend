import { HomePage } from "src/pages/admin/home";
import { RouteObject } from "react-router-dom";
import { ReactNode } from "react";
import { IconHome, IconSupport, IconUsers } from "../../features/layout/assets/icons";
import { SupportPage } from "src/pages/admin/support";
import { UsersPage } from "src/pages/admin/users";
import { EducationPage } from "src/features/education/pages/EducationPage/EducationPage";
import { EducationIcon } from "src/features/users/assets";
import { MailingPage } from "src/features/mailing/pages/MailingPage";
import { IconAnalytics, IconMailing } from "src/shared/assets/img";
import { MessagesPage } from "src/features/messages/pages/MessagesPage";
import { AnalyticPage } from "src/features/analytics/pages/AnalyticPage/AnalyticPage";

export type ISidebarRoute = RouteObject & {
    path: string;
    name: string;
    sidebarProps?: {
        icon: ReactNode;
        counterValue?: number;
    };
    children?: ISidebarRoute[];
};

export const sidebarRoutes: ISidebarRoute[] = [
    {
        path: "/",
        element: <HomePage />,
        name: "Главная",
        sidebarProps: {
            icon: <IconHome />,
        },
    },
    {
        path: "/users",
        element: <UsersPage />,
        name: "Сотрудники",
        sidebarProps: {
            icon: <IconUsers />,
            counterValue: 15,
        },
    },
    {
        path: "/education",
        element: <EducationPage />,
        name: "Обучение",
        sidebarProps: {
            icon: <EducationIcon />,
        },
    },
    {
        path: "/mailing",
        element: <MailingPage />,
        name: "Рассылка",
        sidebarProps: {
            icon: <IconMailing />,
        },
    },
    {
        path: "/analytics",
        element: <AnalyticPage />,
        name: "Аналитика",
        sidebarProps: {
            icon: <IconAnalytics />,
        },
    },
];

export const supportRoute: ISidebarRoute = {
    path: "/messages",
    element: <MessagesPage />,
    name: "Сообщения",
    sidebarProps: {
        icon: <IconSupport />,
    },
};
