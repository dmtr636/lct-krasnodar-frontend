import { observer } from "mobx-react-lite";
import { userStore } from "src/features/users/stores/userStore";
import { EducationEmployeePage } from "src/features/education/pages/EducationEmployeePage/EducationEmployeePage";
import { EducationManagerPage } from "src/features/education/pages/EducationManagerPage/EducationManagerPage";

export const EducationPage = observer(() => {
    if (userStore.currentUser?.role === "EMPLOYEE") {
        return <EducationEmployeePage />;
    } else {
        return <EducationManagerPage />;
    }
});
