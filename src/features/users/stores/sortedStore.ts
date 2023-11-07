import { makeAutoObservable } from "mobx";
import { IUser } from "../interfaces/user";
import { userStore } from "./userStore";

type SortedBy = "name" | "date" | "";
export class SortedStore {
    allEmployees: IUser[] = userStore.users;
    sortedBy: SortedBy = "name";
    constructor() {
        makeAutoObservable(this);
    }
    get sortedEmployees(): IUser[] {
        switch (this.sortedBy) {
            case "name":
                return [...this.allEmployees].sort((a, b) => a.fullName.localeCompare(b.fullName));
            case "date":
                return [...this.allEmployees].sort(
                    (a, b) => new Date(a.createDate) - new Date(b.createDate),
                );
            default:
                return this.allEmployees;
        }
    }

    // Функция для установки метода сортировки
    setSortedBy(method: SortedBy) {
        this.sortedBy = method;
    }

    // ... остальные методы и действия ...
}

export const sortedStore = new SortedStore();
