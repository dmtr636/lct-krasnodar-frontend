import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./app/styles/index.scss";
import { getRoutes } from "src/app/routes";
import { observer } from "mobx-react-lite";

export const App = observer(() => {
    const router = createBrowserRouter(getRoutes());

    return <RouterProvider router={router} />;
});
