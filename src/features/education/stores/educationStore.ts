import { makeAutoObservable } from "mobx";
import { IProgram } from "src/features/education/interfaces/IProgram";
import axios from "axios";
import { COURSES_ENDPOINT, PROGRAMS_ENDPOINT } from "src/shared/api/endpoints";
import { IUserDepartment } from "src/features/users/interfaces/user";
import { ICourse } from "src/features/education/interfaces/ICourse";
import { fileStore } from "src/features/education/stores/fileStore";

export class EducationStore {
    programs: IProgram[] = [];
    courses: ICourse[] = [];
    nameInput = "";
    selectedDepartments: IUserDepartment[] = [];
    selectedCourses: ICourse[] = [];
    selectedProgram: IProgram | null = null;
    durationInput = "";

    constructor() {
        makeAutoObservable(this);
    }

    async fetchAllPrograms() {
        const response = await axios.get(PROGRAMS_ENDPOINT);
        this.programs = response.data;
    }

    async fetchAllCourses() {
        const response = await axios.get(COURSES_ENDPOINT);
        this.courses = response.data;
    }

    async addProgram() {
        const response = await axios.post(PROGRAMS_ENDPOINT, {
            name: this.nameInput,
            departments: this.selectedDepartments,
        });
        this.programs.unshift(response.data);
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
    }

    async updateCourse(course: ICourse) {
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

    async updateCourseProgram(course: ICourse, program: IProgram) {
        course.programId = program.id;
        await axios.put(COURSES_ENDPOINT, {
            id: course.id,
            name: course.name,
            programId: course.programId,
            duration: course.duration,
            fileId: course.file?.id,
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

    get coursesWithoutProgram() {
        return this.courses.filter((c) => !c.programId);
    }

    getCoursesForProgram(programId: number) {
        return this.courses.filter((c) => c.programId === programId);
    }

    getCoursesTotalDurationForProgram(programId: number) {
        return this.courses
            .filter((c) => c.programId === programId)
            .map((c) => c.duration)
            .reduce((a, b) => a + b, 0);
    }
}

export const educationStore = new EducationStore();
