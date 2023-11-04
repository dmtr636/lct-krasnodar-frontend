import axios from "axios";
import { makeAutoObservable } from "mobx";
import { useNavigate } from "react-router-dom";
import {LOGOUT_ENDPOINT, ME_ENDPOINT} from "src/shared/api/endpoints";

class UserStore {
    constructor() {
        makeAutoObservable(this);
    }
    user?: {
        id: string;
        name: string;
        isAuth: boolean;
    };

    async logout() {
        await axios.post(LOGOUT_ENDPOINT);
    }

    async authenticate() {
        axios
            .post(ME_ENDPOINT)
            .then((res) => {
                const data = { ...res.data.cafe, isAuth: true };
                this.user = data;
            })
            .catch((error) => {
                123;
            });
    }
    setUser = (data: any) => {
        this.user = data.cafe;
        console.log(this.user + "123");
    };
}

export const userStore = new UserStore();
