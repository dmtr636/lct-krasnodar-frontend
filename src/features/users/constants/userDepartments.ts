import { IUserDepartment } from "src/features/users/interfaces/user";

export interface IUserDepartmentFilterOption {
    department: IUserDepartment;
    name: string;
}

export const USER_DEPARTMENT_FILTER_OPTIONS: IUserDepartmentFilterOption[] = [
    {
        department: "HR",
        name: "HR",
    },
    {
        department: "MANAGER",
        name: "Руководители",
    },
    {
        department: "CLIENT_SERVICE",
        name: "Клиентский сервис",
    },
    {
        department: "DESIGN",
        name: "Дизайнеры",
    },
    {
        department: "DEVELOPMENT",
        name: "Разработчики",
    },
    {
        department: "PROJECT_MANAGEMENT",
        name: "Проект-менеджеры",
    },
];
