import { makeAutoObservable } from "mobx";
import { IUserTasksFilterOption, USER_TASKS_FILTER_OPTIONS } from "../constants/userFilters";

export class TasksStore {
    allTasks: IUserTasksFilterOption[] = USER_TASKS_FILTER_OPTIONS;
    selectedTasks: IUserTasksFilterOption[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    isTaskSelected(task: IUserTasksFilterOption) {
        return this.selectedTasks.includes(task);
    }

    toggleTask(taskOption: IUserTasksFilterOption) {
        const isSelected = this.selectedTasks.some(
            (selectedTask) => selectedTask.task === taskOption.task,
        );

        if (isSelected) {
            this.selectedTasks = this.selectedTasks.filter(
                (selectedTask) => selectedTask.task !== taskOption.task,
            );
        } else {
            const taskToAdd = this.allTasks.find((task) => task.task === taskOption.task);
            if (taskToAdd) {
                this.selectedTasks.push(taskToAdd);
            }
        }
    }

    clearSelection() {
        this.selectedTasks = [];
    }
    selectAll() {
        this.selectedTasks = this.allTasks;
    }
}

export const tasksStore = new TasksStore();
