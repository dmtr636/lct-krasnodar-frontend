import { makeAutoObservable } from "mobx";
import {
    IUserDepartmentFilterOption,
    USER_DEPARTMENT_FILTER_OPTIONS,
} from "src/features/users/constants/userDepartments";

export class DepartmentsStore {
    allDepartments: IUserDepartmentFilterOption[] = USER_DEPARTMENT_FILTER_OPTIONS;
    selectedDepartments: IUserDepartmentFilterOption[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    isDepartmentSelected(departmentOption: IUserDepartmentFilterOption) {
        return this.selectedDepartments.some(
            (selectedDepartment) => selectedDepartment.department === departmentOption.department,
        );
    }

    toggleDepartment(departmentOption: IUserDepartmentFilterOption) {
        const isSelected = this.isDepartmentSelected(departmentOption);

        if (isSelected) {
            this.selectedDepartments = this.selectedDepartments.filter(
                (selectedDepartment) =>
                    selectedDepartment.department !== departmentOption.department,
            );
        } else {
            const departmentToAdd = this.allDepartments.find(
                (department) => department.department === departmentOption.department,
            );
            if (departmentToAdd) {
                this.selectedDepartments.push(departmentToAdd);
            }
        }
    }

    clearSelection() {
        this.selectedDepartments = [];
    }

    selectAll() {
        this.selectedDepartments = [...this.allDepartments];
    }
}

export const departmentsStore = new DepartmentsStore();
