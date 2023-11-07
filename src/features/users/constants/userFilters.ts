export const USER_DEPARTMENTS = {
    ADMIN: "Администратор",
    HR: "HR",
    MANAGER: "Руководитель",
    CLIENT_SERVICE: "Клиентский сервис",
    DESIGN: "Дизайнер",
    DEVELOPMENT: "Разработчик",
    PROJECT_MANAGEMENT: "Проект-менеджер",
};
export interface IUserTasksFilterOption {
    task: string;
    name: string;
}

export const USER_TASKS_FILTER_OPTIONS: IUserTasksFilterOption[] = [
    {
        task: "NOT_COMPLETE_TASK",
        name: "Есть невыполненные задачи",
    },
    {
        task: "DEADLINE_FAILED",
        name: "Есть просроченные задачи",
    },
    {
        task: "NO_TASK",
        name: "Нет задач",
    },
];
