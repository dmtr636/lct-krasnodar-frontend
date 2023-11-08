import { ICourse } from "src/features/education/interfaces/ICourse";

export interface IUserCourse {
    id: number;
    userId: number;
    startDate: string | null;
    deadlineDate: string | null;
    finishDate: string | null;
    course: ICourse;
    isFinished: boolean;
    remainingDays: number | null;
    testScore: number;
}
