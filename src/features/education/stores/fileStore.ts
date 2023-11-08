import { makeAutoObservable } from "mobx";
import axios from "axios";
import { FILES_ENDPOINT } from "src/shared/api/endpoints";

export class FileStore {
    selectedFile: any = null;
    uploadedFile: {
        id: string;
        url: string;
        name: string;
    } | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async uploadFile() {
        const formData = new FormData();
        formData.set("file", this.selectedFile);
        const response = await axios.post(FILES_ENDPOINT + "/upload", formData);
        this.uploadedFile = response.data;
    }
}

export const fileStore = new FileStore();
