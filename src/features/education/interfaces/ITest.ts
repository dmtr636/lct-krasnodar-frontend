export interface ITest {
    id: number | null;
    question: string;
    answers: string[];
    correctAnswerIndex: number;
    courseId: number | null;
}
