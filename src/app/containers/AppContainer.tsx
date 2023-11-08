import axios from "axios";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { userStore } from "src/features/login/store/userStore";
import { ME_ENDPOINT } from "src/shared/api/endpoints";
import { programStore } from "src/features/education/stores/programStore";

export const AppContainer = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        authenticate();
    }, []);

    const authenticate = async () => {
        axios
            .get(ME_ENDPOINT)
            .then((res) => {
                fetchData();
                userStore.setUser(res.data);
                if (location.pathname === "/login") {
                    navigate("/");
                }
            })
            .catch((error) => {
                navigate("/login");
            });
    };

    const fetchData = () => {
        programStore.fetchAll();
    };

    return <Outlet />;
});
