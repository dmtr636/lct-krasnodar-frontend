import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { educationStore } from "src/features/education/stores/educationStore";
import { userStore } from "src/features/users/stores/userStore";
import { auditStore } from "src/features/education/stores/auditStore";
import { mailingStore } from "src/features/mailing/stores/mailingStore";
import { notificationsStore } from "src/features/notifications/stores/notificationStore";

export const AppContainer = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        authenticate();
    }, []);

    useEffect(() => {
        if (userStore.currentUser) {
            fetchData();

            const timer = setInterval(() => {
                notificationsStore.fetchAllNotifications();
                mailingStore.fetchMessages();
                auditStore.fetchAllEvents();
            }, 10000);
            return () => clearInterval(timer);
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
        educationStore.fetchAllTests();
        educationStore.fetchAllUserCourses();
        auditStore.fetchAllEvents();
        mailingStore.fetchMailings();
        userStore.fetchAllUsers();
        mailingStore.fetchMessages();
        notificationsStore.fetchAllNotifications();
    };

    return <Outlet />;
});
