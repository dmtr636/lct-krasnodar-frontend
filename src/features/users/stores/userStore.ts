import { makeAutoObservable } from "mobx";
import { IUser, IUserDepartment } from "src/features/users/interfaces/user";
import axios from "axios";
import { LOGOUT_ENDPOINT, ME_ENDPOINT, USERS_ENDPOINT } from "src/shared/api/endpoints";
import { departmentsStore } from "./departamentStore";
import { tasksStore } from "./tasksStore";
import { IUserDepartmentFilterOption } from "../constants/userDepartments";
import { educationStore } from "src/features/education/stores/educationStore";

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

        if (
            tasksStore.selectedTasks.length === 1 &&
            tasksStore.selectedTasks.some((st) => st.task === "DEADLINE_FAILED")
        ) {
            users = [];
        }

        if (
            tasksStore.selectedTasks.length === 1 &&
            tasksStore.selectedTasks.some((st) => st.task === "NO_TASK")
        ) {
            users = users.filter(
                (u) =>
                    !educationStore.userCourses
                        .filter((uc) => uc.userId === u.id)
                        .filter((uc) => !uc.finishTimestamp).length,
            );
        }

        if (
            tasksStore.selectedTasks.length === 2 &&
            tasksStore.selectedTasks.some((st) => st.task === "NO_TASK") &&
            tasksStore.selectedTasks.some((st) => st.task === "DEADLINE_FAILED")
        ) {
            users = users.filter(
                (u) =>
                    !educationStore.userCourses
                        .filter((uc) => uc.userId === u.id)
                        .filter((uc) => !uc.finishTimestamp).length,
            );
        }

        if (
            tasksStore.selectedTasks.length === 2 &&
            tasksStore.selectedTasks.some((st) => st.task === "NOT_COMPLETE_TASK") &&
            tasksStore.selectedTasks.some((st) => st.task === "DEADLINE_FAILED")
        ) {
            users = users.filter(
                (u) =>
                    !!educationStore.userCourses
                        .filter((uc) => uc.userId === u.id)
                        .filter((uc) => !uc.finishTimestamp).length,
            );
        }

        if (
            tasksStore.selectedTasks.length === 1 &&
            tasksStore.selectedTasks.some((st) => st.task === "NOT_COMPLETE_TASK")
        ) {
            users = users.filter(
                (u) =>
                    !!educationStore.userCourses
                        .filter((uc) => uc.userId === u.id)
                        .filter((uc) => !uc.finishTimestamp).length,
            );
        }

        return users;
    }
}

export const userStore = new UserStore();
