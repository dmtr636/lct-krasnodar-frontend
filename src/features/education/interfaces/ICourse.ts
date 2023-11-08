import { IFile } from "src/features/education/interfaces/IFile";

export interface ICourse {
    id: number;
    name: string;
    file: IFile | null;
    programId: number | null;
    duration: number;
}
