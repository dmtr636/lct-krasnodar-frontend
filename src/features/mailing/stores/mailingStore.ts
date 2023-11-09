import { makeAutoObservable } from "mobx";
import { IFile } from "src/features/education/interfaces/IFile";
import axios from "axios";
import { MAILING_ENDPOINT } from "src/shared/api/endpoints";
import { IUserDepartment } from "src/features/users/interfaces/user";
import { fileStore } from "src/features/education/stores/fileStore";

export interface IMailing {
    id: number;
    name: string;
    text: string;
    file: IFile | null;
    isTemplate: boolean;
    isRead: boolean;
    departments: IUserDepartment[];
}

export class MailingStore {
    mailings: IMailing[] = [];
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

    get isAddMailingValid() {
        return this.nameInput && this.textInput;
    }
}

export const mailingStore = new MailingStore();
