import styles from "./styles.module.scss";
import { observer } from "mobx-react-lite";
import { userStore } from "src/features/users/stores/userStore";
import { sortedStore } from "src/features/users/stores/sortedStore";
import { USER_DEPARTMENT_FILTER_OPTIONS } from "src/features/users/constants/userDepartments";
import { AnalyticsUserCard } from "../AnalyticsUserCard/AnalyticsUserCard";

export const AnalyticsUserArray = observer(
    ({ responsibilityUser }: { responsibilityUser: boolean }) => {
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
                role={
                    USER_DEPARTMENT_FILTER_OPTIONS.find(
                        (options) => options.department === employee.department,
                    )?.name
                }
                name={employee.fullName}
                link={`/users/${employee.id}`}
                tg={employee.telegram}
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
        const responsibilityDate = employeeData.filter((user) => user.role === "MANAGER");
        const responsibilityArray = responsibilityDate.map((employee) => (
            <AnalyticsUserCard
                key={employee.id}
                img={employee.photoFileUrl}
                role={employee.department}
                name={employee.fullName}
                link={`/users/${employee.id}`}
            />
        ));

        return (
            <div className={styles.container}>
                {/* {EmployeeArray.length === 0 ? (
                <div className={styles.text}>Сотрудников с выбранными фильтрами не найдено</div>
            ) : (
                <>
                    <div className={styles.text}>
                        Отображается{" "}
                        {responsibilityUser
                            ? declOfNum(responsibilityArray.length, [
                                  "сотрудник",
                                  "сотрудника",
                                  "сотрудников",
                              ])
                            : declOfNum(EmployeeArray.length, [
                                  "сотрудник",
                                  "сотрудника",
                                  "сотрудников",
                              ])}
                    </div>
                    <div className={styles.array}>
                        {!responsibilityUser ? EmployeeArray : responsibilityArray}
                    </div>
                </>
            )} */}
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
                    {/* {!responsibilityUser ? EmployeeArray : responsibilityArray} */}
                    {EmployeeArray}
                </div>
            </div>
        );
    },
);
