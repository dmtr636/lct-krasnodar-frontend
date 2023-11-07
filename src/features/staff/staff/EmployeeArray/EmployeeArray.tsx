import styles from "./styles.module.scss";
import { EmployeeCard } from "../EmployeeCard/EmployeeCard";
import { observer } from "mobx-react-lite";
import { userStore } from "src/features/users/stores/userStore";
import { sortedStore } from "src/features/users/stores/sortedStore";

export const EmployeeArray = observer(() => {
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
                .sort((a, b) => new Date(a.createTimestamp) - new Date(b.createTimestamp));
            break;
        // Добавьте другие кейсы сортировки здесь по необходимости
    }
    const EmployeeArray = employeeData.map((employee) => (
        <EmployeeCard
            key={employee.id}
            img={employee.photoFileUrl}
            role={employee.department}
            name={employee.fullName}
            link={`/users/${employee.id}`}
        />
    ));
    function declOfNum(number: number, titles: string[]) {
        const cases = [2, 0, 1, 1, 1, 2];
        const index =
            number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5];
        return `${number} ${titles[index]}`;
    }
    return (
        <div className={styles.container}>
            {EmployeeArray.length === 0 ? (
                <div className={styles.text}>Сотрудников с выбранными фильтрами не найдено</div>
            ) : (
                <>
                    <div className={styles.text}>
                        Отображается{" "}
                        {declOfNum(EmployeeArray.length, [
                            "сотрудник",
                            "сотрудника",
                            "сотрудников",
                        ])}
                    </div>
                    <div className={styles.array}>{EmployeeArray}</div>
                </>
            )}
        </div>
    );
});
