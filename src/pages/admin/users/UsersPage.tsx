import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { userStore } from "src/features/users/stores/userStore";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userFilters";

export const UsersPage = observer(() => {
    useEffect(() => {
        userStore.fetchAllUsers().then(test);
    }, []);

    const test = async () => {
        console.log(JSON.stringify(userStore.allUsers));

        // Поиск
        userStore.searchInput = "Дмитрий";
        console.log(JSON.stringify(userStore.users));
        userStore.searchInput = "";

        // Фильтр по HR
        userStore.selectedDepartments.add(USER_DEPARTMENT_FILTER_OPTIONS[0].department);
        console.log(JSON.stringify(userStore.users));
        userStore.selectedDepartments.clear();
    };

    return <h1>Сотрудники</h1>;
});
