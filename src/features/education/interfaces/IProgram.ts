import { IUserDepartment } from "src/features/users/interfaces/user";

export interface IProgram {
    id: number;
    name: string;
    departments: IUserDepartment[];
}
