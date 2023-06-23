"use strict";
// note: this is not real mvvm, a binder tool is required to achieve mvvm architecture.
// note: apperantly the view should have access to viewmodel but viewmodel shouldn't have access to view.
// note: view directly binds to viewmodels properties, and viewmodel has "property changed" event listeners
// note: and when a property changes, it updates the view with event handlers.
// note: also to keep in mind, the model is usually on another machine, like a server and/or database,
// note: and viewmodel is the so called "live data", the representation of the real data on client
// note: i could also implement it with getter setters, and i should've but i chose to do it with
// note: event listeners
// model
class Task {
    constructor(title, description, creationTime) {
        this.title = title;
        this.description = description;
        this.creationTime = creationTime;
    }
}
class CompletableTask extends Task {
    constructor(title, description, creationTime) {
        super(title, description, creationTime);
        this.isDone = false;
    }
    markAsDone() {
        this.isDone = true;
    }
}
class CompletableTaskWithDeadline extends CompletableTask {
    // public ongoing: boolean;
    constructor(title, description, creationTime, deadline) {
        super(title, description, creationTime);
        if (deadline.getTime() < this.creationTime.getTime()) {
            throw new Error("deadline is before creation time");
        }
        this.deadline = deadline;
        // this.ongoing = true;
    }
    isOngoing() {
        if (this.deadline.getTime() <= new Date().getTime()) {
            return false;
        }
        return true;
    }
    markAsDone() {
        if (!this.isOngoing()) {
            return;
        }
        super.markAsDone();
    }
}
class TaskDatabase {
    constructor() {
        const creation = new Date();
        creation.setSeconds(creation.getSeconds() - 10);
        const deadline = new Date();
        deadline.setMinutes(deadline.getMinutes(), deadline.getSeconds() + 1);
        this.tasks = [
            new Task("jfdkslall", "jfkdlsaş", new Date()),
            new CompletableTask("completable task", "this is a completable task here.", new Date()),
            new CompletableTaskWithDeadline("completable task with deadline", "this is a completable task here.", new Date(), deadline),
        ];
    }
    add_task(task) {
        this.tasks.push(task);
    }
    get_tasks() {
        return this.tasks;
    }
    get_a_task(taskTitle) {
        return this.tasks.filter(t => t.title === taskTitle)[0];
    }
}
// there should've been more than one viewmodel, for task and task list
// viewmodel
class ViewModel {
    constructor(taskDataBase) {
        this.title = "";
        this.description = "";
        this.date = new Date();
        this.taskType = "normal";
        this.saveable = true;
        this.taskDataBase = taskDataBase;
        this.eventTasksToDisplay = false;
        this.eventTaskType = false;
        this.eventSaveable = false;
        this.fetchTasksToDisplay();
    }
    get saveable() {
        return this._saveable;
    }
    set saveable(state) {
        this._saveable = state;
        this.pingEventSaveable();
    }
    get date() {
        return this._date;
    }
    set date(dateArg) {
        this._date = dateArg;
        this.updateSaveable();
    }
    get taskType() {
        return this._taskType;
    }
    set taskType(type) {
        this._taskType = type;
        this.pingEventTaskType();
        this.updateSaveable();
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
        // this.callbacks["title"]();
    }
    get description() {
        return this._description;
    }
    set description(value) {
        this._description = value;
    }
    get tasksToDisplay() {
        this.fetchTasksToDisplay();
        return this._tasksToDisplay;
    }
    set tasksToDisplay(tasksList) {
        // use the getter
        this._tasksToDisplay = tasksList;
    }
    dateToValue(date) {
        return date.toISOString().split(".")[0];
    }
    valueToDate(value) {
        return new Date(value);
    }
    isSaveable() {
        if (this.date.getTime() < new Date().getTime()) {
            return false;
        }
        return true;
    }
    updateSaveable() {
        this.saveable = this.isSaveable();
    }
    saveTask() {
        if (!this.saveable) {
            return;
        }
        let task;
        if (this.taskType === "normal") {
            task = new Task(this.title, this.description, new Date());
        }
        else if (this.taskType === "completable") {
            task = new CompletableTask(this.title, this.description, new Date());
        }
        else if (this.taskType === "deadlined") {
            task = new CompletableTaskWithDeadline(this.title, this.description, new Date(), this.date);
        }
        else {
            throw new Error("unexpected taskType");
        }
        if (!task) {
            throw new Error("task not valid");
        }
        this.taskDataBase.add_task(task);
        this.tasksToDisplay;
    }
    fetchTasksToDisplay() {
        this._tasksToDisplay = this.taskDataBase.get_tasks();
        this.pingEventTasksToDisplay();
    }
    eventListenerTasksToDisplay(callback) {
        setInterval(() => {
            if (this.eventTasksToDisplay) {
                callback();
                this.eventTasksToDisplay = !this.eventTasksToDisplay;
            }
        }, 50);
    }
    eventListenerTaskType(callback) {
        setInterval(() => {
            if (this.eventTaskType) {
                callback();
                this.eventTaskType = !this.eventTaskType;
            }
        }, 50);
    }
    eventListenerSaveable(callback) {
        setInterval(() => {
            if (this.eventSaveable) {
                callback();
                this.eventSaveable = !this.eventSaveable;
            }
        }, 50);
    }
    pingEventTasksToDisplay() {
        this.eventTasksToDisplay = true;
    }
    pingEventTaskType() {
        this.eventTaskType = true;
    }
    pingEventSaveable() {
        this.eventSaveable = true;
    }
    markTaskAsDone(taskTitle) {
        const task = this.taskDataBase.get_a_task(taskTitle);
        if (!(task instanceof CompletableTask) && !(task instanceof CompletableTaskWithDeadline)) {
            return;
        }
        task.markAsDone();
        this.tasksToDisplay;
    }
}
class View {
    constructor() {
        this.titleInputElement = document.querySelector("#title");
        this.descriptionInputElement = document.querySelector("#description");
        this.addTaskButton = document.querySelector("#add-task");
        this.taskListElement = document.querySelector(".task-list");
        this.taskTypeFormElement = document.querySelector(".task-type-choice");
        this.deadlineDateInputElement = document.querySelector("#deadline-date");
        this.dateErrorMessageElement = document.querySelector(".date-error-message");
        this.elementsToAddEventListenerTo = [];
    }
    createNormalTaskElement(task) {
        const taskElement = document.createElement("li");
        taskElement.setAttribute("class", "task");
        const taskTitleElement = document.createElement("div");
        taskTitleElement.setAttribute("class", "task-title");
        taskTitleElement.textContent = task.title;
        const taskDescriptionElement = document.createElement("div");
        taskDescriptionElement.setAttribute("class", "task-description");
        taskDescriptionElement.textContent = task.description;
        const taskCreationDateElement = document.createElement("div");
        taskCreationDateElement.setAttribute("class", "task-creation-date");
        const dateString = task.creationTime.toLocaleDateString("en-US", {
            hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
        });
        taskCreationDateElement.textContent = dateString;
        taskElement.appendChild(taskTitleElement);
        taskElement.appendChild(taskDescriptionElement);
        taskElement.appendChild(taskCreationDateElement);
        return taskElement;
    }
    createCompletableTaskElement(task) {
        const taskElement = document.createElement("li");
        taskElement.setAttribute("class", "task");
        const taskTitleElement = document.createElement("div");
        taskTitleElement.setAttribute("class", "task-title");
        taskTitleElement.textContent = task.title;
        const taskDescriptionElement = document.createElement("div");
        taskDescriptionElement.setAttribute("class", "task-description");
        taskDescriptionElement.textContent = task.description;
        const taskCreationDateElement = document.createElement("div");
        taskCreationDateElement.setAttribute("class", "task-creation-date");
        const dateString = task.creationTime.toLocaleDateString("en-US", {
            hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
        });
        taskCreationDateElement.textContent = dateString;
        const taskIsDoneElement = document.createElement("div");
        taskIsDoneElement.setAttribute("class", "task-is-done");
        if (task.isDone) {
            taskIsDoneElement.textContent = "Completed";
        }
        else {
            taskIsDoneElement.textContent = "Ongoing";
        }
        const taskMarkAsDoneButton = document.createElement("button");
        taskMarkAsDoneButton.setAttribute("class", "task-mark-as-done");
        taskMarkAsDoneButton.setAttribute("id", task.title);
        taskMarkAsDoneButton.textContent = "Mark As Done";
        this.elementsToAddEventListenerTo.push({ element: taskMarkAsDoneButton, behaviour: "completable" });
        if (task.isDone)
            taskMarkAsDoneButton.setAttribute("disabled", "true");
        taskElement.appendChild(taskTitleElement);
        taskElement.appendChild(taskDescriptionElement);
        taskElement.appendChild(taskCreationDateElement);
        taskElement.appendChild(taskIsDoneElement);
        taskElement.appendChild(taskMarkAsDoneButton);
        return taskElement;
    }
    createCompletableWithDeadlineTaskElement(task) {
        const taskElement = document.createElement("li");
        taskElement.setAttribute("class", "task");
        const taskTitleElement = document.createElement("div");
        taskTitleElement.setAttribute("class", "task-title");
        taskTitleElement.textContent = task.title;
        const taskDescriptionElement = document.createElement("div");
        taskDescriptionElement.setAttribute("class", "task-description");
        taskDescriptionElement.textContent = task.description;
        const taskCreationDateElement = document.createElement("div");
        taskCreationDateElement.setAttribute("class", "task-creation-date");
        const dateString = task.creationTime.toLocaleDateString("en-US", {
            hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
        });
        taskCreationDateElement.textContent = dateString;
        const taskDeadlineDateElement = document.createElement("div");
        taskDeadlineDateElement.setAttribute("class", "task-deadline-date");
        const deadlineDateString = task.deadline.toLocaleDateString("en-US", {
            hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
        });
        taskDeadlineDateElement.textContent = deadlineDateString;
        const taskIsDoneElement = document.createElement("div");
        taskIsDoneElement.setAttribute("class", "task-is-done");
        if (task.isDone) {
            taskIsDoneElement.textContent = "Completed";
        }
        else {
            if (!task.isOngoing()) {
                taskIsDoneElement.textContent = "Missed";
            }
            else {
                taskIsDoneElement.textContent = "Ongoing";
            }
        }
        const taskMarkAsDoneButton = document.createElement("button");
        taskMarkAsDoneButton.setAttribute("class", "task-mark-as-done");
        taskMarkAsDoneButton.setAttribute("id", task.title);
        taskMarkAsDoneButton.textContent = "Mark As Done";
        if (!task.isOngoing() || task.isDone) {
            taskMarkAsDoneButton.setAttribute("disabled", "true");
        }
        this.elementsToAddEventListenerTo.push({
            element: taskMarkAsDoneButton, behaviour: "completableWithDeadline"
        });
        taskElement.appendChild(taskTitleElement);
        taskElement.appendChild(taskDescriptionElement);
        taskElement.appendChild(taskCreationDateElement);
        taskElement.appendChild(taskIsDoneElement);
        taskElement.appendChild(taskMarkAsDoneButton);
        taskElement.appendChild(taskDeadlineDateElement);
        return taskElement;
    }
    createTaskElement(task) {
        if (task instanceof CompletableTaskWithDeadline) {
            return this.createCompletableWithDeadlineTaskElement(task);
        }
        if (task instanceof CompletableTask) {
            return this.createCompletableTaskElement(task);
        }
        if (task instanceof Task) {
            return this.createNormalTaskElement(task);
        }
        throw new Error("couldn't match task type");
    }
    renderTasks(tasksToDisplay) {
        while (this.taskListElement.firstChild) {
            this.taskListElement.firstChild.remove();
        }
        for (const task of tasksToDisplay) {
            const taskElement = this.createTaskElement(task);
            this.taskListElement.appendChild(taskElement);
        }
    }
    disableDeadlineDateInputElement() {
        view.deadlineDateInputElement.setAttribute("disabled", "true");
    }
    enableDeadlineDateInputElement() {
        view.deadlineDateInputElement.removeAttribute("disabled");
    }
    hideDateErrorMessageElement() {
        this.dateErrorMessageElement.setAttribute("class", "date-error-message hidden");
    }
    exposeDateErrorMessageElement() {
        this.dateErrorMessageElement.setAttribute("class", "date-error-message");
    }
    setDateErrorMessage(message) {
        this.dateErrorMessageElement.textContent = message;
    }
    getDateErrorMessage() {
        return this.dateErrorMessageElement.textContent;
    }
}
const bindData = (view, viewModel) => {
    const callbacks = {
        completable: {
            eventType: "click",
            callback: (button) => {
                return () => {
                    viewModel.markTaskAsDone(button.id);
                };
            }
        },
        completableWithDeadline: {
            eventType: "click",
            callback: (button) => {
                return () => {
                    viewModel.markTaskAsDone(button.id);
                };
            }
        }
    };
    viewModel.eventListenerTasksToDisplay(() => {
        view.renderTasks(viewModel.tasksToDisplay);
    });
    viewModel.eventListenerTaskType(() => {
        if (viewModel.taskType === "deadlined") {
            view.enableDeadlineDateInputElement();
        }
        else {
            view.disableDeadlineDateInputElement();
        }
    });
    viewModel.eventListenerSaveable(() => {
        if (!viewModel.saveable) {
            if (viewModel.taskType === "deadlined") {
                view.setDateErrorMessage("• Date should be in a further date");
                view.exposeDateErrorMessageElement();
            }
            else {
                view.setDateErrorMessage("");
                view.hideDateErrorMessageElement();
            }
        }
        else {
            view.setDateErrorMessage("");
            view.hideDateErrorMessageElement();
        }
    });
    setInterval(() => {
        if (view.elementsToAddEventListenerTo.length > 0) {
            // const elementList = view.elementsToAddEventListenerTo;
            // for (const element of elementList) {
            const elementObj = view.elementsToAddEventListenerTo.pop();
            const element = elementObj === null || elementObj === void 0 ? void 0 : elementObj.element;
            // const subscript = element.className.replace(/-/gi, "_");
            const subscript = elementObj === null || elementObj === void 0 ? void 0 : elementObj.behaviour;
            const callbackObj = callbacks[subscript];
            element.addEventListener(callbackObj.eventType, callbackObj.callback(element));
            // }
        }
    }, 50);
    setInterval(() => {
        view.renderTasks(viewModel.tasksToDisplay);
    }, 1000);
    view.titleInputElement.addEventListener("input", (event) => {
        viewModel.title = view.titleInputElement.value;
    });
    view.descriptionInputElement.addEventListener("input", (event) => {
        viewModel.description = view.descriptionInputElement.value;
    });
    view.addTaskButton.addEventListener("click", (event) => {
        viewModel.saveTask();
        // try {
        //   viewModel.saveTask();
        //   view.hideDateErrorMessageElement();
        //   view.setDateErrorMessage("");
        // } catch (error) {
        //   view.exposeDateErrorMessageElement();
        //   view.setDateErrorMessage(error);
        // }
    });
    const idToTaskType = {
        "normal-task-type-radio": "normal",
        "completable-task-type-radio": "completable",
        "deadlined-task-type-radio": "deadlined",
    };
    view.taskTypeFormElement.addEventListener("input", event => {
        viewModel.taskType = idToTaskType[event.target.id];
    });
    view.deadlineDateInputElement.addEventListener("input", event => {
        // viewModel.date = event.
        viewModel.date = viewModel.valueToDate(view.deadlineDateInputElement.value);
    });
    view.deadlineDateInputElement.value = viewModel.dateToValue(viewModel.date);
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
