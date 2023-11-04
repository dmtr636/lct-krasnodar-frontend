import { HomePage } from "src/pages/admin/home";
import { OrdersPage } from "src/pages/admin/orders";
import { IngredientsPage } from "src/pages/admin/ingredients";
import { AdditivesPage } from "src/pages/admin/additives";
import { MenuPage } from "src/pages/admin/menu";
import { PromotionsPage } from "src/pages/admin/promotions";
import { SettingsPage } from "src/pages/admin/settings";
import { RouteObject } from "react-router-dom";
import { ReactNode } from "react";
import { IconAttention, IconHome, IconOrders } from "../../features/sidebar/assets/icons";
import { SettingsAppearancePage } from "src/pages/admin/settings/appearance";
import { SettingsAboutPage } from "src/pages/admin/settings/about";
import { SettingsPaymentPage } from "../../pages/admin/settings/payment";
import { SettingsDeliveryPage } from "../../pages/admin/settings/delivery";
import { SettingsDocumentsPage } from "../../pages/admin/settings/documents";

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
        path: "/orders",
        element: <OrdersPage />,
        name: "Заказы",
        sidebarProps: {
            icon: <IconOrders />,
            counterValue: 21,
        },
    },
    {
        path: "/ingredients",
        element: <IngredientsPage />,
        name: "Ингредиенты",
        sidebarProps: {
            icon: <IconAttention />,
        },
    },
    {
        path: "/additives",
        element: <AdditivesPage />,
        name: "Добавки",
        sidebarProps: {
            icon: <IconAttention />,
        },
    },
    {
        path: "/menu",
        element: <MenuPage />,
        name: "Меню",
        sidebarProps: {
            icon: <IconAttention />,
        },
    },
    {
        path: "/promotions",
        element: <PromotionsPage />,
        name: "Акции",
        sidebarProps: {
            icon: <IconAttention />,
        },
    },
    {
        path: "/settings",
        element: <SettingsPage />,
        name: "Настройки",
        sidebarProps: {
            icon: <IconAttention />,
        },
        children: [
            {
                path: "/settings/appearance",
                element: <SettingsAppearancePage />,
                name: "Внешний вид",
            },
            {
                path: "/settings/about",
                element: <SettingsAboutPage />,
                name: "О кафе",
            },
            {
                path: "/settings/payment",
                element: <SettingsPaymentPage />,
                name: "Способы оплаты",
            },
            {
                path: "/settings/delivery",
                element: <SettingsDeliveryPage />,
                name: "Доставка",
            },
            {
                path: "/settings/documents",
                element: <SettingsDocumentsPage />,
                name: "Документы",
            },
        ] as ISidebarRoute[],
    },
];
