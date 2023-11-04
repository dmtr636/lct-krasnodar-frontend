import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app/styles/index.scss";
import { routes } from "src/app/routes";

const router = createBrowserRouter(routes);

export const App = () => {
    return <RouterProvider router={router} />;
};
