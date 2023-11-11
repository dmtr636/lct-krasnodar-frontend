import styles from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { userStore } from "src/features/users/stores/userStore";
import { sortedStore } from "src/features/users/stores/sortedStore";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { AnalyticsUserCard } from "../AnalyticsUserCard/AnalyticsUserCard";
import { useEffect } from "react";
import { USER_DEPARTMENTS } from "src/features/users/constants/userFilters";
import { useLocation } from "react-router-dom";

export const AnalyticsUserArray = observer(
    ({
        responsibilityUser,
        setUserNumber,
    }: {
        responsibilityUser: boolean;
        setUserNumber: (arg: number) => void;
    }) => {
        let employeeData = userStore.users;
        const sortedBy = sortedStore.sortedBy;
        switch (sortedBy) {
            case "name":
                employeeData = employeeData
                    .slice()
                    .sort((a, b) => a.fullName.localeCompare(b.fullName));
                break;
            case "date":
                employeeData = employeeData
                    .slice()
                    .sort(
                        (a, b) =>
                            new Date(a.createTimestamp).getTime() -
                            new Date(b.createTimestamp).getTime(),
                    );
                break;
            // Добавьте другие кейсы сортировки здесь по необходимости
        }
        const EmployeeArray = employeeData.map((employee) => (
            <AnalyticsUserCard
                key={employee.id}
                img={employee.photoFileUrl}
                role={USER_DEPARTMENTS[employee.department]}
                name={employee.fullName}
                link={`/users/${employee.id}?tab=analytics`}
                tg={employee.telegram}
                user={employee}
                error={false}
            />
        ));
        function declOfNum(number: number, titles: string[]) {
            const cases = [2, 0, 1, 1, 1, 2];
            const index =
                number % 100 > 4 && number % 100 < 20
                    ? 2
                    : cases[number % 10 < 5 ? number % 10 : 5];
            return `${number} ${titles[index]}`;
        }
        const user = userStore.currentUser;

        const responsibilityDate = employeeData.filter((e) => e.responsibleUserId === user?.id);
        const responsibilityArray = responsibilityDate.map((employee) => (
            <AnalyticsUserCard
                key={employee.id}
                img={employee.photoFileUrl}
                role={employee.department}
                name={employee.fullName}
                link={`/users/${employee.id}`}
                error={false}
                user={employee}
            />
        ));
        setUserNumber(responsibilityUser ? responsibilityArray.length : EmployeeArray.length);
        useEffect(() => {
            setUserNumber(responsibilityUser ? responsibilityArray.length : EmployeeArray.length);
        }, [userStore.users]);
        return (
            <div className={styles.container}>
                <>
                    <div className={styles.header}>
                        <div className={styles.headerUser}>Сотрудник</div>
                        <div className={styles.headerProgres}>
                            Полный прогресс <br />
                            обучения
                        </div>
                        <div className={styles.headerDate}>
                            Ближайший срок <br />
                            сдачи курса
                        </div>
                    </div>
                    <div className={styles.array}>
                        {!responsibilityUser ? EmployeeArray : responsibilityArray}
                    </div>
                </>

                {/* <div className={styles.header}>
                    <div className={styles.headerUser}>Сотрудник</div>
                    <div className={styles.headerProgres}>
                        Полный прогресс <br />
                        обучения
                    </div>
                    <div className={styles.headerDate}>
                        Ближайший срок <br />
                        сдачи курса
                    </div>
                </div>
                <div className={styles.array}>
                    {!responsibilityUser ? EmployeeArray : responsibilityArray}
                    {EmployeeArray}
                </div> */}
            </div>
        );
    },
);
