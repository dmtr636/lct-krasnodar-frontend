import { makeAutoObservable } from "mobx";
import axios from "axios";
import { AUDIT_ENDPOINT } from "src/shared/api/endpoints";

export interface IAuditEvent {
    id: number;
    timestamp: string;
    eventType: "LOGIN" | "LOGOUT" | "COURSE_FINISHED";
    userId: number;
    text: string | null;
}

export class AuditStore {
    events: IAuditEvent[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAllEvents() {
        const response = await axios.get(AUDIT_ENDPOINT);
        this.events = response.data;
    }
}

export const auditStore = new AuditStore();
