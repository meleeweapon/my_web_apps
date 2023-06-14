"use strict";
// model
class Task {
    constructor(title, description, creationTime, deadline) {
        this.title = title;
        this.description = description;
        this.creationTime = creationTime;
        this.deadline = deadline;
    }
}
class TaskDatabase {
    constructor() {
        this.tasks = [];
    }
    add_task(task) {
        this.tasks.push(task);
    }
}
const taskDataBase = new TaskDatabase();
const viewModel = {
    title: "",
    description: "",
    addTask() {
        const task = new Task(this.title, this.description, new Date(), null);
        taskDataBase.add_task(task);
    }
};
const bindData = () => {
    const titleInputElement = document.querySelector("#title");
    const descriptionInputElement = document.querySelector("#description");
    const addTaskButton = document.querySelector("#add-task");
    titleInputElement.addEventListener("input", (event) => {
        viewModel.title = titleInputElement.value;
    });
    descriptionInputElement.addEventListener("input", (event) => {
        viewModel.description = descriptionInputElement.value;
    });
    addTaskButton.addEventListener("click", (event) => {
        viewModel.addTask();
    });
};
document.addEventListener("DOMContentLoaded", (event) => {
    bindData();
});
