import { makeAutoObservable } from "mobx";
import { IUser, IUserDepartment } from "src/features/users/interfaces/user";
import axios from "axios";
import { LOGOUT_ENDPOINT, ME_ENDPOINT, USERS_ENDPOINT } from "src/shared/api/endpoints";
import { departmentsStore } from "./departamentStore";
import { tasksStore } from "./tasksStore";
import { IUserDepartmentFilterOption } from "../constants/userDepartments";

export class UserStore {
    allUsers: IUser[] = [];
    currentUser: IUser | null = null;
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

    async deleteUser(user: IUser) {
        const response = await axios.delete(USERS_ENDPOINT + "/" + user.id);
        this.allUsers = this.allUsers.filter((u) => u.id !== user.id);
    }

    async updateUser(user: IUser) {
        const response = await axios.put(USERS_ENDPOINT, {
            ...user,
            photoFileId: user.photoFile?.id,
        });
    }

    async authenticate() {
        try {
            const response = await axios.get(ME_ENDPOINT);
            this.currentUser = response.data;
            return true;
        } catch (e) {
            return false;
        }
    }

    async logout() {
        this.currentUser = null;
        await axios.post(LOGOUT_ENDPOINT);
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
