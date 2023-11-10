import axios from "axios";
import { observer } from "mobx-react-lite";
import { LOGOUT_ENDPOINT } from "src/shared/api/endpoints";
import { ContentWithHeaderLayout } from "src/features/layout/ui/ContentWithHeaderLayout/ContentWithHeaderLayout";

export const HomePage = observer(() => {
    const logOut = () => axios.post(LOGOUT_ENDPOINT);
    return (
        <ContentWithHeaderLayout title={"Главная"}>
            <h1 onClick={() => logOut()}>Главная</h1>
        </ContentWithHeaderLayout>
    );
});
