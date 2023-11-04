import axios from "axios";
import { observer } from "mobx-react-lite";
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userStore } from "src/features/login/store/userStore";
import { ME_ENDPOINT } from "src/shared/api/endpoints";

export const AppContainer = observer(() => {
    const navigate = useNavigate();

    const authenticate = async () => {
        axios
            .get(ME_ENDPOINT)
            .then((res) => {
                userStore.setUser(res.data);
                navigate("/");
            })
            .catch((error) => {
                navigate("/login");
            });
    };
    React.useEffect(() => {
        authenticate();
    }, []);
    return <Outlet />;
});
