import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { educationStore } from "src/features/education/stores/educationStore";
import { userStore } from "src/features/users/stores/userStore";

export const AppContainer = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        if (userStore.currentUser) {
            fetchData();
        }
    }, [userStore.currentUser]);

    const authenticate = async () => {
        const isAuthenticated = await userStore.authenticate();
        if (isAuthenticated) {
            if (location.pathname === "/login") {
                navigate("/");
            }
        } else {
            navigate("/login");
        }
    };

    const fetchData = () => {
        educationStore.fetchAllPrograms();
        educationStore.fetchAllCourses();
    };

    return <Outlet />;
});
