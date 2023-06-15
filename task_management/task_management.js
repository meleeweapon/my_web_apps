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
        this.tasks = [new Task("jfdkslall", "jfkdlsaş", new Date(), null)];
    }
    add_task(task) {
        this.tasks.push(task);
    }
    get_tasks() {
        return this.tasks;
    }
}
const taskDataBase = new TaskDatabase();
const viewModel = {
    // make getter setters
    title: "",
    description: "",
    tasksToDisplay: [],
    addTask() {
        const task = new Task(this.title, this.description, new Date(), null);
        taskDataBase.add_task(task);
    },
    fetchTasks() {
        this.tasksToDisplay = taskDataBase.get_tasks();
    },
    renderTasks(taskListElemnt) {
        while (taskListElemnt.firstChild) {
            taskListElemnt.firstChild.remove();
        }
        for (const task of viewModel.tasksToDisplay) {
            const taskElement = createTaskElement(task);
            taskListElemnt.appendChild(taskElement);
            console.log(task);
        }
    }
};
const createTaskElement = (task) => {
    const taskElement = document.createElement("div");
    taskElement.setAttribute("class", "task");
    const taskTitleElement = document.createElement("div");
    taskTitleElement.setAttribute("class", "task-title");
    taskTitleElement.textContent = task.title;
    const taskDescriptionElement = document.createElement("div");
    taskDescriptionElement.setAttribute("class", "task-description");
    taskDescriptionElement.textContent = task.description;
    taskElement.appendChild(taskTitleElement);
    taskElement.appendChild(taskDescriptionElement);
    return taskElement;
};
const bindData = () => {
    // add task block
    const titleInputElement = document.querySelector("#title");
    const descriptionInputElement = document.querySelector("#description");
    const addTaskButton = document.querySelector("#add-task");
    const taskListElement = document.querySelector(".task-list");
    titleInputElement.addEventListener("input", (event) => {
        viewModel.title = titleInputElement.value;
    });
    descriptionInputElement.addEventListener("input", (event) => {
        viewModel.description = descriptionInputElement.value;
    });
    addTaskButton.addEventListener("click", (event) => {
        viewModel.addTask();
        viewModel.fetchTasks();
        viewModel.renderTasks(taskListElement);
    });
    taskListElement.addEventListener("", (event) => {
        viewModel.fetchTasks();
        viewModel.renderTasks(taskListElement);
    });
};
document.addEventListener("DOMContentLoaded", (event) => {
    bindData();
});
