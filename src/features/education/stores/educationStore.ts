import { makeAutoObservable } from "mobx";
import { IProgram } from "src/features/education/interfaces/IProgram";
import axios from "axios";
import {
    COURSES_ENDPOINT,
    PROGRAMS_ENDPOINT,
    TESTS_ENDPOINT,
    USER_COURSES_ENDPOINT,
} from "src/shared/api/endpoints";
import { IUserDepartment } from "src/features/users/interfaces/user";
import { ICourse } from "src/features/education/interfaces/ICourse";
import { fileStore } from "src/features/education/stores/fileStore";
import { ITest } from "src/features/education/interfaces/ITest";
import { IUserCourse } from "src/features/education/interfaces/IUserCourse";

export class EducationStore {
    programs: IProgram[] = [];
    courses: ICourse[] = [];
    nameInput = "";
    selectedDepartments: IUserDepartment[] = [];
    selectedCourses: ICourse[] = [];
    selectedProgram: IProgram | null = null;
    durationInput = "";
    creatingTests: ITest[] = [];
    createdTests: ITest[] = [];
    tests: ITest[] = [];
    userCourses: IUserCourse[] = [];
    userCoursesToDelete: IUserCourse[] = [];
    userCoursesToAdd: IUserCourse[] = [];
    rating = 0;
    answers: Record<string, number> = {};

    constructor() {
        makeAutoObservable(this);
    }

    async handleSaveUserCourses() {
        for (const u of this.userCoursesToDelete) {
            await axios.delete(USER_COURSES_ENDPOINT + "/" + u.id);
        }
        for (const u of this.userCoursesToAdd) {
            await axios.post(USER_COURSES_ENDPOINT, {
                userId: u.userId,
                courseId: u.courseId,
            });
        }
    }

    async fetchAllPrograms() {
        const response = await axios.get(PROGRAMS_ENDPOINT);
        this.programs = response.data;
    }

    async fetchAllCourses() {
        const response = await axios.get(COURSES_ENDPOINT);
        this.courses = response.data;
    }

    async fetchAllTests() {
        const response = await axios.get(TESTS_ENDPOINT);
        this.tests = response.data;
    }

    async fetchAllUserCourses() {
        const response = await axios.get(USER_COURSES_ENDPOINT);
        this.userCourses = response.data;
    }

    async addTests(course: ICourse) {
        this.createdTests.forEach(async (t) => {
            const response = await axios.post(TESTS_ENDPOINT, {
                question: t.question,
                answers: t.answers,
                correctAnswerIndex: t.correctAnswerIndex,
                courseId: course.id,
            });
            this.tests.push(response.data);
        });
    }

    async addProgram() {
        const response = await axios.post(PROGRAMS_ENDPOINT, {
            name: this.nameInput,
            departments: this.selectedDepartments,
        });
        this.programs.unshift(response.data);
        this.selectedCourses.forEach((c) => {
            this.updateCourseProgram(c, response.data);
        });
    }

    async addCourse() {
        if (fileStore.selectedFile) {
            await fileStore.uploadFile();
        }
        const response = await axios.post(COURSES_ENDPOINT, {
            name: this.nameInput,
            programId: this.selectedProgram?.id,
            duration: Number(this.durationInput),
            fileId: fileStore.uploadedFile?.id,
        });
        this.courses.unshift(response.data);
        this.addTests(response.data);
    }

    async updateCourse(course: ICourse) {
        for (const test of this.getTestsForCourse(course.id)) {
            test.id && (await this.deleteTest(test.id));
        }
        await this.addTests(course);
        if (fileStore.selectedFile) {
            await fileStore.uploadFile();
        }
        const response = await axios.put(COURSES_ENDPOINT, {
            id: course.id,
            name: this.nameInput,
            programId: this.selectedProgram?.id,
            duration: Number(this.durationInput),
            fileId: fileStore.uploadedFile?.id,
        });
        this.courses = this.courses.map((c) => (c.id === course.id ? response.data : c));
    }

    async updateCourseProgram(course: ICourse, program: IProgram | null) {
        course.programId = program?.id || null;
        await axios.put(COURSES_ENDPOINT, {
            id: course.id,
            name: course.name,
            programId: course.programId,
            duration: course.duration,
            fileId: course.file?.id,
        });
    }

    async updateUserCourse(userCourse: IUserCourse) {
        userCourse.rating = this.rating;
        userCourse.finishTimestamp = new Date().toISOString();
        await axios.put(USER_COURSES_ENDPOINT, userCourse);
        const next = this.userCourses
            .filter((uc) => uc.userId === userCourse.userId)
            .find((uc) => !uc.startTimestamp);
        if (next) {
            next.startTimestamp = new Date().toISOString();
            await axios.put(USER_COURSES_ENDPOINT, next);
        }
    }

    async updateProgram(program: IProgram) {
        const response = await axios.put(PROGRAMS_ENDPOINT, {
            id: program.id,
            name: this.nameInput,
            departments: this.selectedDepartments,
        });
        this.programs = this.programs.map((p) => (p.id === program.id ? response.data : p));
        this.selectedCourses.forEach((c) => {
            this.updateCourseProgram(c, program);
        });
        this.courses
            .filter((c) => c.programId === program.id)
            .filter((c) => !this.selectedCourses.some((sc) => sc.id === c.id))
            .forEach((c) => {
                this.updateCourseProgram(c, null);
            });
    }

    async deleteProgram(id: number) {
        await axios.delete(PROGRAMS_ENDPOINT + "/" + id);
        this.programs = this.programs.filter((p) => p.id !== id);
    }

    async deleteCourse(id: number) {
        await axios.delete(COURSES_ENDPOINT + "/" + id);
        this.courses = this.courses.filter((c) => c.id !== id);
    }

    async deleteTest(id: number) {
        await axios.delete(TESTS_ENDPOINT + "/" + id);
        this.tests = this.tests.filter((t) => t.id !== id);
    }

    get coursesWithoutProgram() {
        return this.courses.filter((c) => !c.programId);
    }

    getCoursesForProgram(programId: number) {
        return this.courses.filter((c) => c.programId === programId);
    }

    getTestsForCourse(courseId: number) {
        return this.tests.filter((t) => t.courseId === courseId);
    }

    getCourseByUserCourse(userCourse?: IUserCourse | null) {
        return this.courses.find((c) => c.id === userCourse?.courseId);
    }

    getCoursesTotalDurationForProgram(programId: number) {
        return this.courses
            .filter((c) => c.programId === programId)
            .map((c) => c.duration)
            .reduce((a, b) => a + b, 0);
    }

    get unselectedCourses() {
        return this.coursesWithoutProgram.filter((c) => !this.selectedCourses.includes(c));
    }

    get isAddProgramValid() {
        return !!this.nameInput;
    }

    get isAddCourseValid() {
        return this.nameInput && !!this.durationInput && fileStore.selectedFile;
    }
}

export const educationStore = new EducationStore();
