export type IUserRole = "ADMIN" | "MANAGER" | "EMPLOYEE";
export type IUserDepartment =
    | "ADMIN"
    | "HR"
    | "MANAGER"
    | "CLIENT_SERVICE"
    | "DESIGN"
    | "DEVELOPMENT"
    | "PROJECT_MANAGEMENT";

export interface IUser {
    id: number;
    email: string;
    role: IUserRole;
    department: IUserDepartment;
    lastName: string;
    firstName: string;
    patronymic: string;
    telegram: string;
    phone: string;
    fullName: string;
    photoFileUrl: string | null;
    createTimestamp: string;
    responsibleUserId: number | null;
    tasks: string | null;
    skills: string[];
    photoFile: {
        id: string;
        url: string;
        name: string;
    } | null;
}
