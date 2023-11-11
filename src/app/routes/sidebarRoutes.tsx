import { HomePage } from "src/pages/admin/home";
import { RouteObject } from "react-router-dom";
import { ReactNode } from "react";
import { IconHome, IconSupport, IconUsers } from "../../features/layout/assets/icons";
import { UsersPage } from "src/pages/admin/users";
import { EducationIcon } from "src/features/users/assets";
import { MailingPage } from "src/features/mailing/pages/MailingPage";
import { IconAnalytics, IconMailing } from "src/shared/assets/img";
import { MessagesPage } from "src/features/messages/pages/MessagesPage";
import { mailingStore } from "src/features/mailing/stores/mailingStore";
import { userStore } from "src/features/users/stores/userStore";
import { EducationPage } from "src/features/education/pages/EducationPage/EducationPage";
import { AnalyticPage } from "src/features/analytics/pages/AnalyticPage/AnalyticPage";
import { notificationsStore } from "src/features/notifications/stores/notificationStore";
import { educationStore } from "src/features/education/stores/educationStore";

export type ISidebarRoute = RouteObject & {
    path: string;
    name: string;
    sidebarProps?: {
        icon: ReactNode;
        counterValue?: number;
    };
    children?: ISidebarRoute[];
};

export const getSidebarRoutes = (): ISidebarRoute[] => [
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
        name: userStore.currentUser?.role === "EMPLOYEE" ? "Команда" : "Сотрудники",
        sidebarProps: {
            icon: <IconUsers />,
        },
    },
    {
        path: "/education",
        element: <EducationPage />,
        name: "Обучение",
        sidebarProps: {
            icon: <EducationIcon />,
            counterValue: educationStore.userCourses
                .filter((uc) => uc.userId === userStore.currentUser?.id)
                .filter((uc) => !uc.finishTimestamp).length,
        },
    },
    ...(userStore.currentUser?.role === "EMPLOYEE"
        ? []
        : [
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
          ]),
];

export const getSupportRoute = (): ISidebarRoute => ({
    path: "/messages",
    element: <MessagesPage />,
    name: "Сообщения",
    sidebarProps: {
        icon: <IconSupport />,
        counterValue: mailingStore.messages
            .filter((m) => m.userId === userStore.currentUser?.id)
            .filter((m) => !m.isRead).length,
    },
});
