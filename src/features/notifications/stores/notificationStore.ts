import { makeAutoObservable } from "mobx";
import axios from "axios";
import { NOTIFICATIONS_ENDPOINT } from "src/shared/api/endpoints";

export interface INotification {
    id: number;
    userId: number;
    text: string;
    type:
        | "COURSE_ASSIGN"
        | "COURSE_DEADLINE"
        | "EMPLOYEE_COURSE_DEADLINE"
        | "ADD_SKILLS_IN_PROFILE";
    url: string;
    isRead: boolean;
}

export class NotificationStore {
    notifications: INotification[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAllNotifications() {
        const response = await axios.get(NOTIFICATIONS_ENDPOINT);
        this.notifications = response.data;
    }

    async updateNotification(notification: INotification) {
        await axios.put(NOTIFICATIONS_ENDPOINT, notification);
    }
}

export const notificationsStore = new NotificationStore();
