import { makeAutoObservable } from "mobx";
import { IProgram } from "src/features/education/interfaces/IProgram";
import axios from "axios";
import { PROGRAMS_ENDPOINT } from "src/shared/api/endpoints";
import { IUserDepartment } from "src/features/users/interfaces/user";

export class ProgramStore {
    programs: IProgram[] = [];
    nameInput = "";
    selectedDepartments: IUserDepartment[] = [];
    selectedProgram: IProgram | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAll() {
        const response = await axios.get(PROGRAMS_ENDPOINT);
        this.programs = response.data;
    }

    async addProgram() {
        const response = await axios.post(PROGRAMS_ENDPOINT, {
            name: this.nameInput,
            departments: this.selectedDepartments,
        });
        this.programs.unshift(response.data);
    }

    async deleteProgram(id: number) {
        await axios.delete(PROGRAMS_ENDPOINT + "/" + id);
        this.programs = this.programs.filter((p) => p.id !== id);
    }
}

export const programStore = new ProgramStore();
