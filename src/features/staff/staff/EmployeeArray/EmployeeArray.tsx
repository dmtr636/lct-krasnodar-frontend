import React from "react";
import styles from "./styles.module.scss";
import { EmployeeCard } from "../EmployeeCard/EmployeeCard";
export const EmployeeArray = ({}) => {
    const employeeData = [
        { role: "фронт", name: "Александр Дроздов Юрьевич", link: "/bimbas" },
        { role: "дисигнер", name: "Кирилл Дроздов Николаевич", link: "/bimbas" },
        { role: "бэк", name: "Дмитрий Староста Сергеевич", link: "/bimbas" },
    ];
    const EmployeeArray = employeeData.map((employee, index) => (
        <EmployeeCard key={index} role={employee.role} name={employee.name} link={employee.link} />
    ));
    return <div className={styles.container}>{EmployeeArray}</div>;
};
