import axios from "axios";
import { observer } from "mobx-react-lite";
import { LOGOUT_ENDPOINT } from "src/shared/api/endpoints";

export const HomePage = observer(() => {
    const logOut = () => axios.post(LOGOUT_ENDPOINT);
    return <h1 onClick={() => logOut()}>Главная</h1>;
});
