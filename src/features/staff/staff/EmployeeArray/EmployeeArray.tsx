import React from "react";
import styles from "./styles.module.scss";
import { EmployeeCard } from "../EmployeeCard/EmployeeCard";
import { observer } from "mobx-react-lite";
import { userStore } from "src/features/users/stores/userStore";

export const EmployeeArray = observer(() => {
    const employeeData = userStore.users;
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
