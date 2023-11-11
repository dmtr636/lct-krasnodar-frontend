import { makeAutoObservable } from "mobx";
import { IFile } from "src/features/education/interfaces/IFile";
import axios from "axios";
import { MAILING_ENDPOINT, MESSAGES_ENDPOINT } from "src/shared/api/endpoints";
import { IUserDepartment } from "src/features/users/interfaces/user";
import { fileStore } from "src/features/education/stores/fileStore";
import { userStore } from "src/features/users/stores/userStore";

export interface IMailing {
    id: number;
    name: string;
    text: string;
    file: IFile | null;
    isTemplate: boolean;
    isRead: boolean;
    departments: IUserDepartment[];
}

export interface IMessage {
    id: number;
    name: string;
    text: string;
    file: IFile | null;
    isRead: boolean;
    userId: number;
    creationTimestamp: string;
}

export class MailingStore {
    mailings: IMailing[] = [];
    messages: IMessage[] = [];
    nameInput = "";
    textInput = "";
    selectedDepartments: IUserDepartment[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    async fetchMailings() {
        const response = await axios.get(MAILING_ENDPOINT);
        this.mailings = response.data;
    }

    async fetchMessages() {
        const response = await axios.get(MESSAGES_ENDPOINT);
        this.messages = response.data;
    }

    async deleteMailing(mailing: IMailing) {
        await axios.delete(MAILING_ENDPOINT + "/" + mailing.id);
        this.mailings = this.mailings.filter((m) => m.id !== mailing.id);
    }

    async addMailing() {
        const mailing = {
            name: this.nameInput,
            text: this.textInput,
            departments: this.selectedDepartments,
            file: fileStore.uploadedFile,
            isTemplate: false,
        };
        const response = await axios.post(MAILING_ENDPOINT, mailing);
        this.mailings.push(response.data);

        let users = [...userStore.allUsers, { id: 1 }];
        if (this.selectedDepartments.length) {
            users = userStore.allUsers.filter((u) =>
                this.selectedDepartments.includes(u.department),
            );
        }
        users.forEach(async (u) => {
            const message = {
                name: this.nameInput,
                text: this.textInput,
                file: fileStore.uploadedFile,
                userId: u.id,
            };
            const response = await axios.post(MESSAGES_ENDPOINT, message);
            this.messages.push(response.data);
        });
    }

    async addTemplateMailing() {
        if (fileStore.selectedFile) {
            await fileStore.uploadFile();
        }
        const mailing = {
            name: this.nameInput,
            text: this.textInput,
            departments: this.selectedDepartments,
            file: fileStore.uploadedFile,
            isTemplate: true,
        };
        const response = await axios.post(MAILING_ENDPOINT, mailing);
        this.mailings.push(response.data);
    }

    async updateMailingTemplate(mailing: IMailing) {
        if (fileStore.selectedFile) {
            await fileStore.uploadFile();
        }
        const updatedMailing = {
            ...mailing,
            name: this.nameInput,
            text: this.textInput,
            file: fileStore.uploadedFile,
            isTemplate: true,
        };
        const response = await axios.put(MAILING_ENDPOINT, updatedMailing);
        this.mailings = this.mailings.map((m) => (m.id === mailing.id ? response.data : m));
    }

    async updateMessage(message: IMessage) {
        await axios.put(MESSAGES_ENDPOINT, message);
    }

    get isAddMailingValid() {
        return this.nameInput && this.textInput;
    }
}

export const mailingStore = new MailingStore();
