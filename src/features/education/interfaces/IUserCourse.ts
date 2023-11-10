export interface IUserCourse {
    id: number;
    userId: number;
    courseId: number;
    startTimestamp: string | null;
    finishTimestamp: string | null;
    rating: number | null;
    testScore: number | null;
}
