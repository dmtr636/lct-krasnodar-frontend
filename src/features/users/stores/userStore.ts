import { makeAutoObservable } from "mobx";
import { IUser, IUserDepartment } from "src/features/users/interfaces/user";
import axios from "axios";
import { USERS_ENDPOINT } from "src/shared/api/endpoints";
import { departmentsStore } from "./deportamentStore";
import { tasksStore } from "./tasksStore";
import { IUserDepartmentFilterOption } from "../constants/userDepartments";

export class UserStore {
    allUsers: IUser[] = [];
    searchInput = "";
    selectedDepartments = new Set<IUserDepartment>();

    constructor() {
        makeAutoObservable(this);
    }

    isDepartmentFilterOptionSelected(option: IUserDepartmentFilterOption) {
        return this.selectedDepartments.has(option.department);
    }

    async fetchAllUsers() {
        const response = await axios.get(USERS_ENDPOINT);
        this.allUsers = response.data;
    }

    get users() {
        let users = this.allUsers;

        if (this.searchInput.length) {
            users = users.filter((u) =>
                u.fullName.toLowerCase().includes(this.searchInput.toLowerCase()),
            );
        }

        if (this.selectedDepartments.size) {
            users = users.filter((u) =>
                [...this.selectedDepartments].some((d) => d === u.department),
            );
        }

        if (departmentsStore.selectedDepartments.length) {
            users = users.filter((user) =>
                departmentsStore.selectedDepartments.some(
                    (department) => department.department === user.department,
                ),
            );
        }

        if (tasksStore.selectedTasks.length) {
            users = users.filter((user) =>
                tasksStore.selectedTasks.some((task) => user.tasks?.includes(task.task)),
            );
        }

        return users;
    }
}

export const userStore = new UserStore();
