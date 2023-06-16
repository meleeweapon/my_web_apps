"use strict";
// note: this is not real mvvm, a binder tool is required to achieve mvvm architecture
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
// viewmodel
class ViewModel {
    constructor(taskDataBase) {
        this.title = "";
        this.description = "";
        this.taskDataBase = taskDataBase;
        this.eventTasksToDisplay = false;
        this.fetchTasksToDisplay();
    }
    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
        // this.callbacks["title"]();
    }
    get description() {
        return this._description;
    }
    set description(description) {
        this._description = description;
    }
    get tasksToDisplay() {
        this.fetchTasksToDisplay();
        return this._tasksToDisplay;
    }
    set tasksToDisplay(tasksToDisplay) {
        // use the getter
        this._tasksToDisplay = tasksToDisplay;
    }
    saveTask() {
        const task = new Task(this.title, this.description, new Date(), null);
        this.taskDataBase.add_task(task);
        this.tasksToDisplay;
    }
    fetchTasksToDisplay() {
        this._tasksToDisplay = this.taskDataBase.get_tasks();
        this.pingEventTasksToListen();
    }
    eventListenerTasksToDisplay(callback) {
        setInterval(() => {
            if (this.eventTasksToDisplay) {
                callback();
                this.eventTasksToDisplay = !this.eventTasksToDisplay;
                console.log("event listened");
            }
        }, 50);
    }
    pingEventTasksToListen() {
        console.log("pinged");
        this.eventTasksToDisplay = true;
        console.log(this.eventTasksToDisplay);
    }
}
class View {
    constructor() {
        this.titleInputElement = document.querySelector("#title");
        this.descriptionInputElement = document.querySelector("#description");
        this.addTaskButton = document.querySelector("#add-task");
        this.taskListElement = document.querySelector(".task-list");
    }
    static createTaskElement(task) {
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
    }
    renderTasks(tasksToDisplay) {
        while (this.taskListElement.firstChild) {
            this.taskListElement.firstChild.remove();
        }
        for (const task of tasksToDisplay) {
            const taskElement = View.createTaskElement(task);
            this.taskListElement.appendChild(taskElement);
            console.log(task);
        }
    }
}
const bindData = (view, viewModel) => {
    viewModel.eventListenerTasksToDisplay(() => {
        view.renderTasks(viewModel.tasksToDisplay);
    });
    view.titleInputElement.addEventListener("input", (event) => {
        viewModel.title = view.titleInputElement.value;
    });
    view.descriptionInputElement.addEventListener("input", (event) => {
        viewModel.description = view.descriptionInputElement.value;
    });
    view.addTaskButton.addEventListener("click", (event) => {
        viewModel.saveTask();
    });
};
// class EventListener {
//   private tasksToDisplayEvent: boolean;
//   private tasksToDisplayCallback: Function;
//   constructor(tasksToDisplayCallback: Function) {
//     this.tasksToDisplayEvent = false;
//     this.tasksToDisplayCallback = tasksToDisplayCallback;
//     setInterval(() => {
//       if (this.tasksToDisplayEvent) {
//         this.tasksToDisplayCallback();
//         this.tasksToDisplayEvent = !this.tasksToDisplayEvent;
//       }
//     }, 50)
//   }
// }
const taskDataBase = new TaskDatabase();
const view = new View();
const viewModel = new ViewModel(taskDataBase);
document.addEventListener("DOMContentLoaded", (event) => {
    bindData(view, viewModel);
});
