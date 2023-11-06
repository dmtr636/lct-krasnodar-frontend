import { makeAutoObservable } from "mobx";
import { IUser, IUserDepartment } from "src/features/users/interfaces/user";
import axios from "axios";
import { USERS_ENDPOINT } from "src/shared/api/endpoints";
import { IUserDepartmentFilterOption } from "src/features/users/constants/userFilters";

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
        return users;
    }
}

export const userStore = new UserStore();
