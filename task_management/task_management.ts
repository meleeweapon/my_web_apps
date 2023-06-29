// note: this is not real mvvm, a binder tool is required to achieve mvvm architecture.
// note: apperantly the view should have access to viewmodel but viewmodel shouldn't have access to view.
// note: view directly binds to viewmodels properties, and viewmodel has "property changed" event listeners
// note: and when a property changes, it updates the view with event handlers.
// note: also to keep in mind, the model is usually on another machine, like a server and/or database,
// note: and viewmodel is the so called "live data", the representation of the real data on client
// note: i could also implement it with getter setters, and i should've but i chose to do it with
// note: event listeners


// next up: impl deleting tasks

// model
class Task {
  public title: string;
  public description: string;
  public creationTime: Date;

  constructor(
    title: string, 
    description: string,
    creationTime: Date,
  ) {
    this.title = title;
    this.description = description;
    this.creationTime = creationTime;
  }
}

class CompletableTask extends Task {
  public isDone: boolean;
  constructor(
    title: string, 
    description: string,
    creationTime: Date,
    isDone?: boolean) {
      super(title, description, creationTime);
      this.isDone = false;
      if (isDone!==undefined) { this.isDone = isDone; }
  }

  public markAsDone(): void {
    this.isDone = true;
  }
}

class CompletableTaskWithDeadline extends CompletableTask {
  public deadline: Date;
  // public ongoing: boolean;
  constructor(
    title: string, 
    description: string,
    creationTime: Date,
    deadline: Date,
    isDone?: boolean) {
      super(title, description, creationTime, isDone);
      if (deadline.getTime() < this.creationTime.getTime()) {
        throw new Error("deadline is before creation time");
      }
      this.deadline = deadline;
      // this.ongoing = true;
    }

    public isOngoing(): boolean {
      if (this.deadline.getTime() <= new Date().getTime()) {
        return false;
      }
      return true;
    }

    public markAsDone(): void {
      if (!this.isOngoing()) {
        return;
      }
      super.markAsDone();
    }
}


class TaskDatabase {
  public tasks: Task[];
  private tasksKey: string;
  private localStrg: Storage;
  constructor(localStrg: Storage) {
    this.tasksKey = "tasks";
    this.localStrg = localStrg;
    let rawData = localStrg.getItem(this.tasksKey);
    // if (rawData === null) { throw new Error("rawData was null"); }
    if (rawData === null) {
      this.localStrg.setItem(this.tasksKey, JSON.stringify([]))
      rawData = localStrg.getItem(this.tasksKey) as string;
    }
    const tasksData = JSON.parse(rawData);
    this.tasks = this.reconstruct_instances(tasksData);
  }

  delete_task(title: string): void {
    const task = this.get_a_task(title);
    if (task === null) { throw new Error("task was null"); }
    const taskIndex = this.tasks.indexOf(task);
    this.tasks.splice(taskIndex, 1);
    this.save_to_local_storage();
  }

  mark_as_done(title: string): void {
    const task = this.get_a_task(title) as CompletableTask;
    if (task === null) { throw new Error("task was null"); }
    if (!("isDone" in task)) { throw new Error("task did not contain isDone"); }
    task.markAsDone();
    this.save_to_local_storage();
  }

  save_to_local_storage(): void {
    this.localStrg.setItem(this.tasksKey, JSON.stringify(this.tasks));
  }

  reconstruct_instances(tasksData: object[]): Task[] {
    return tasksData.map(dataObj => {
      if ("deadline" in dataObj) {
        return new CompletableTaskWithDeadline(
          dataObj.title, 
          dataObj.description, 
          new Date(dataObj.creationTime), 
          new Date(dataObj.deadline), 
          dataObj.isDone
        );
      }
      if ("isDone" in dataObj) {
        return new CompletableTask(
          dataObj.title, dataObj.description, new Date(dataObj.creationTime), dataObj.isDone
        );
      }
      return new Task(
        dataObj.title, dataObj.description, new Date(dataObj.creationTime)
      );
    });
  }

  add_task(task: Task): void {
    if (!this.title_is_valid(task.title)) { throw new Error("title is not unique"); }
    this.tasks.push(task);
    this.save_to_local_storage();
  }

  get_tasks(): Task[] {
    return this.tasks;
  }

  title_is_valid(title: string): boolean {
    return this.get_a_task(title) === null;
  }

  get_a_task(taskTitle: string): Task | null {
    const matches = this.tasks.filter(t => t.title === taskTitle);
    return matches.length > 0 ? matches[0] : null;
  }
}

interface saveTaskResult {
  success: boolean,
  info: Error;
}

type TaskType = "normal" | "completable" | "deadlined";


// there should've been more than one viewmodel, for task and task list
// viewmodel
class ViewModel {
  private _title: string;
  private _description: string;
  private _tasksToDisplay: Task[];
  private _taskType: TaskType;
  private _date: Date | null;
  private _saveable: boolean;
  private taskDataBase: TaskDatabase;
  private eventTasksToDisplay: boolean;
  private eventTaskType: boolean;
  private eventSaveable: boolean;

  constructor(taskDataBase: TaskDatabase) {
    this.taskDataBase = taskDataBase;
    this.title = "";
    this.description = "";
    this.date = null;
    this.taskType = "normal";
    this.saveable = true;
    this.eventTasksToDisplay = false;
    this.eventTaskType = false;
    this.eventSaveable = false;
    this.fetchTasksToDisplay();
  }

  public get saveable(): boolean {
    return this._saveable;
  }
  public set saveable(state: boolean) {
    this._saveable = state;
    this.pingEventSaveable();
  }
  public get date(): Date | null {
    return this._date;
  }
  public set date(dateArg) {
    this._date = dateArg;
    this.updateSaveable()
  }
  public get taskType(): TaskType {
    return this._taskType;
  }
  public set taskType(type: TaskType) {
    this._taskType = type;
    this.pingEventTaskType();
    this.updateSaveable()
  }
  public get title(): string {
    return this._title;
  }
  public set title(value: string) {
    this._title = value;
    this.updateSaveable();
    // this.callbacks["title"]();
  }
  public get description(): string {
    return this._description;
  }
  public set description(value: string) {
    this._description = value;
  }
  public get tasksToDisplay(): Task[] {
    this.fetchTasksToDisplay();
    return this._tasksToDisplay;
  }
  public set tasksToDisplay(tasksList: Task[]) {
    // use the getter
    this._tasksToDisplay = tasksList;
  }

  public dateToValue(date: Date | null): string {
    if (!date) { return ""; }
    return date.toISOString().split(".")[0];
  }
  public valueToDate(value: string): Date | null {
    if (value === "") { return null; }
    return new Date(value);
  }

  public isSaveable(): boolean {
    if (this.taskType === "deadlined") {
      if (!this.date) { return false; }
      if (this.date.getTime() < new Date().getTime()) {
        return false;
      }
    }
    if (!this.validTitle(this.title)) {
      return false;
    }
    return true;
  }
  public updateSaveable(): void {
    this.saveable = this.isSaveable();
  }
  public validTitle(title: string): boolean {
    return this.taskDataBase.title_is_valid(title);
  }

  public saveTask(): void {
    if (!this.saveable) {
      return;
    }

    let task;
    if (this.taskType === "normal") {
      task = new Task(this.title, this.description, new Date());
    } else if (this.taskType === "completable") {
      task = new CompletableTask(this.title, this.description, new Date());
    } else if (this.taskType === "deadlined") {
      if (!this.date) { throw new Error("date was null"); }
      task = new CompletableTaskWithDeadline(this.title, this.description, new Date(), this.date);
    } else {
      throw new Error("unexpected taskType");
    }
    if (!task) {
      throw new Error("task not valid");
    }

    if (!this.validTitle(this.title)) { return; }
    this.taskDataBase.add_task(task);
    this.tasksToDisplay;
  }
  private fetchTasksToDisplay(): void {
    this._tasksToDisplay = this.taskDataBase.get_tasks();
    this.pingEventTasksToDisplay();
  }

  public deleteTask(title: string): void {
    this.taskDataBase.delete_task(title);
    this.tasksToDisplay;
  }

  public eventListenerTasksToDisplay(callback: Function): void {
    setInterval(() => {
      if (this.eventTasksToDisplay) {
        callback();
        this.eventTasksToDisplay = !this.eventTasksToDisplay;
      }
    }, 50);
  }
  public eventListenerTaskType(callback: Function): void {
    setInterval(() => {
      if (this.eventTaskType) {
        callback();
        this.eventTaskType = !this.eventTaskType;
      }
    }, 50);
  }
  public eventListenerSaveable(callback: Function): void {
    setInterval(() => {
      if (this.eventSaveable) {
        callback();
        this.eventSaveable = !this.eventSaveable;
      }
    }, 50);
  }

  private pingEventTasksToDisplay(): void {
    this.eventTasksToDisplay = true;
  }
  private pingEventTaskType(): void {
    this.eventTaskType = true;
  }
  private pingEventSaveable(): void {
    this.eventSaveable = true;
  }

  public markTaskAsDone(taskTitle: string): void {
    const task = this.taskDataBase.get_a_task(taskTitle);
    if (task === null) { throw new Error("couldn't find task in db"); }
    if (!(task instanceof CompletableTask) && !(task instanceof CompletableTaskWithDeadline)) {
      return;
    }
    // task.markAsDone();
    this.taskDataBase.mark_as_done(taskTitle);
    this.tasksToDisplay;
  }
}


class View {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public addTaskButton: HTMLButtonElement;
  public taskListElement: HTMLUListElement;
  public elementsToAddEventListenerTo: {
    element: HTMLElement, behaviour: "completable" | "completableWithDeadline" | "delete"}[];
  public taskTypeFormElement: HTMLFormElement;
  public deadlineDateInputElement: HTMLInputElement;
  public dateErrorMessageElement: HTMLElement;
  public eventElementsToAddEventListenerTo: boolean;

  constructor() {
    this.titleInputElement = document.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
    this.addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;
    this.taskListElement = document.querySelector(".task-list") as HTMLUListElement;
    this.taskTypeFormElement = document.querySelector(".task-type-choice") as HTMLFormElement;
    this.deadlineDateInputElement = document.querySelector("#deadline-date") as HTMLInputElement;
    this.dateErrorMessageElement = document.querySelector(".date-error-message") as HTMLElement;
    this.elementsToAddEventListenerTo = [];
    this.eventElementsToAddEventListenerTo = false;
  }

  public eventListenerElementsToAddEventListenerTo(callback: Function): void {
    setInterval(() => {
      if (this.elementsToAddEventListenerTo.length > 0) {
        callback();
      }
    }, 50);
  }

  private createTaskRootElement(task: Task | CompletableTask | CompletableTaskWithDeadline): HTMLElement {
    let classString = "task";
    const taskElement = document.createElement("li");
    if (task instanceof CompletableTask) {
      if (task.isDone) {
        classString = "task completed";
      } else {
        if (task instanceof CompletableTaskWithDeadline) {
          if (!task.isOngoing()) {
            classString = "task missed";
          }
        }
      }
    }
    taskElement.setAttribute("class", classString);
    return taskElement;
  }

  private createDeleteTaskButtonContainer(task: Task): HTMLElement {
    const deleteTaskButtonContainer = document.createElement("div");
    deleteTaskButtonContainer.setAttribute("id", `delete-${task.title}`);
    deleteTaskButtonContainer.innerHTML = `
      <svg class="delete-button" width="32" height="32" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xml:space="preserve">
      <defs>
      </defs>
      <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
        <path d="M 13.4 88.492 L 1.508 76.6 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 69.318 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 L 88.492 13.4 c 2.011 2.011 2.011 5.271 0 7.282 L 20.682 88.492 C 18.671 90.503 15.411 90.503 13.4 88.492 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
        <path d="M 69.318 88.492 L 1.508 20.682 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 13.4 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 l 67.809 67.809 c 2.011 2.011 2.011 5.271 0 7.282 L 76.6 88.492 C 74.589 90.503 71.329 90.503 69.318 88.492 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: rgb(236,0,0); fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
      </g>
      </svg>
    `;
    return deleteTaskButtonContainer;
  }

  private createTitleElement(task: Task): HTMLElement {
    const taskTitleElement = document.createElement("div");
    taskTitleElement.setAttribute("class", "task-title");
    taskTitleElement.textContent = task.title;
    return taskTitleElement;
  }

  private createDescriptionElement(task: Task): HTMLElement {
    const taskDescriptionElement = document.createElement("div");
    taskDescriptionElement.setAttribute("class", "task-description");
    taskDescriptionElement.textContent = task.description;
    return taskDescriptionElement;
  }

  private createCreationDateElement(task: Task): HTMLElement {
    const taskCreationDateElement = document.createElement("div");
    taskCreationDateElement.setAttribute("class", "task-creation-date");
    const dateString = task.creationTime.toLocaleDateString("en-US", {
      hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
    });
    taskCreationDateElement.textContent = dateString;
    return taskCreationDateElement;
  }

  private appendChildren(parent: HTMLElement,elements: HTMLElement[]): void {
    for (const element of elements) {
      parent.appendChild(element);
    }
  }

  public createNormalTaskElement(task: Task): HTMLElement {
    const taskElement = this.createTaskRootElement(task);
    const taskTitleElement = this.createTitleElement(task);
    const taskDescriptionElement = this.createDescriptionElement(task);
    const taskCreationDateElement = this.createCreationDateElement(task);

    const deleteTaskButtonContainer = this.createDeleteTaskButtonContainer(task);
    this.elementsToAddEventListenerTo.push({
      element: deleteTaskButtonContainer, behaviour: "delete"});

    const taskDataContainer = document.createElement("div");
    taskDataContainer.setAttribute("class", "task-data-container");
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.setAttribute("class", "delete-button-container");

    const dataElements = [taskTitleElement, taskDescriptionElement, taskCreationDateElement];
    this.appendChildren(taskDataContainer, dataElements);
    deleteButtonContainer.appendChild(deleteTaskButtonContainer);

    taskElement.appendChild(taskDataContainer);
    taskElement.appendChild(deleteButtonContainer);

    return taskElement;
  }

  private createTaskIsDoneElement(task: CompletableTask): HTMLElement {
    const taskIsDoneElement = document.createElement("div");
    taskIsDoneElement.setAttribute("class", "task-is-done");
    if (task.isDone) {
      taskIsDoneElement.textContent = "Completed";
    } else {
      taskIsDoneElement.textContent = "Ongoing";
    }
    return taskIsDoneElement;
  }

  private createTaskMarkAsDoneButton(task: CompletableTask): HTMLElement {
    const taskMarkAsDoneButton = document.createElement("button");
    taskMarkAsDoneButton.setAttribute("class", "task-mark-as-done");
    taskMarkAsDoneButton.setAttribute("id", task.title);
    taskMarkAsDoneButton.textContent = "Mark As Done";
    if (task.isDone)
      taskMarkAsDoneButton.setAttribute("disabled", "true");
    return taskMarkAsDoneButton;
  }

  public createCompletableTaskElement(task: CompletableTask): HTMLElement {
    const taskElement = this.createTaskRootElement(task);
    const taskTitleElement = this.createTitleElement(task);
    const taskDescriptionElement = this.createDescriptionElement(task);
    const taskCreationDateElement = this.createCreationDateElement(task);
    const taskIsDoneElement = this.createTaskIsDoneElement(task);
    const taskMarkAsDoneButton = this.createTaskMarkAsDoneButton(task);
    this.elementsToAddEventListenerTo.push({element: taskMarkAsDoneButton, behaviour: "completable"});

    const deleteTaskButtonContainer = this.createDeleteTaskButtonContainer(task);
    this.elementsToAddEventListenerTo.push({
      element: deleteTaskButtonContainer, behaviour: "delete"});

    const taskDataContainer = document.createElement("div");
    taskDataContainer.setAttribute("class", "task-data-container");
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.setAttribute("class", "delete-button-container");

    const dataElements = [
      taskTitleElement,
      taskDescriptionElement,
      taskCreationDateElement,
      taskIsDoneElement,
      taskMarkAsDoneButton,
    ]
    this.appendChildren(taskDataContainer, dataElements);
    deleteButtonContainer.appendChild(deleteTaskButtonContainer);

    taskElement.appendChild(taskDataContainer);
    taskElement.appendChild(deleteButtonContainer);

    return taskElement;
  }

  private createTaskDeadlineDateElement(task: CompletableTaskWithDeadline): HTMLElement {
    const taskDeadlineDateElement = document.createElement("div");
    taskDeadlineDateElement.setAttribute("class", "task-deadline-date");
    const deadlineDateString = task.deadline.toLocaleDateString("en-US", {
      hour: "numeric", minute: "numeric", day: "numeric", weekday: "long", month: "short"
    });
    taskDeadlineDateElement.textContent = `Deadline: ${deadlineDateString}`;
    return taskDeadlineDateElement;
  }

  private createDeadlinedTaskIsDoneElement(task: CompletableTaskWithDeadline): HTMLElement {
    const taskIsDoneElement = document.createElement("div");
    taskIsDoneElement.setAttribute("class", "task-is-done");
    if (task.isDone) {
      taskIsDoneElement.textContent = "Completed";
    } else {
      if (!task.isOngoing()) {
        taskIsDoneElement.textContent = "Missed";
      } else {
        taskIsDoneElement.textContent = "Ongoing";
      }
    }
    return taskIsDoneElement;
  }

  private createDeadlinedTaskMarkAsDoneElement(task: CompletableTaskWithDeadline): HTMLElement {
    const taskMarkAsDoneButton = document.createElement("button");
    taskMarkAsDoneButton.setAttribute("class", "task-mark-as-done");
    taskMarkAsDoneButton.setAttribute("id", task.title);
    taskMarkAsDoneButton.textContent = "Mark As Done";
    if (!task.isOngoing() || task.isDone) {
      taskMarkAsDoneButton.setAttribute("disabled", "true");
    }
    return taskMarkAsDoneButton;
  }

  public createCompletableWithDeadlineTaskElement(task: CompletableTaskWithDeadline): HTMLElement {
    const taskElement = this.createTaskRootElement(task);
    const taskTitleElement = this.createTitleElement(task);
    const taskDescriptionElement = this.createDescriptionElement(task);
    const taskCreationDateElement = this.createCreationDateElement(task);
    const taskDeadlineDateElement = this.createTaskDeadlineDateElement(task);
    const taskIsDoneElement = this.createDeadlinedTaskIsDoneElement(task);
    const taskMarkAsDoneButton = this.createDeadlinedTaskMarkAsDoneElement(task);
    this.elementsToAddEventListenerTo.push({
      element: taskMarkAsDoneButton, behaviour: "completableWithDeadline"});
    const deleteTaskButtonContainer = this.createDeleteTaskButtonContainer(task);
    this.elementsToAddEventListenerTo.push({
      element: deleteTaskButtonContainer, behaviour: "delete"});

    const taskDataContainer = document.createElement("div");
    taskDataContainer.setAttribute("class", "task-data-container");
    const deleteButtonContainer = document.createElement("div");
    deleteButtonContainer.setAttribute("class", "delete-button-container");

    const dataElements = [
      taskTitleElement,
      taskDescriptionElement,
      taskCreationDateElement,
      taskIsDoneElement,
      taskDeadlineDateElement,
      taskMarkAsDoneButton,
    ]
    this.appendChildren(taskDataContainer, dataElements);
    deleteButtonContainer.appendChild(deleteTaskButtonContainer);

    taskElement.appendChild(taskDataContainer);
    taskElement.appendChild(deleteButtonContainer);

    return taskElement;
  }

  public createTaskElement(task: Task): HTMLElement {
    if (task instanceof CompletableTaskWithDeadline) {
      return this.createCompletableWithDeadlineTaskElement(task);
    }
    if (task instanceof CompletableTask) {
      return this.createCompletableTaskElement(task);
    }
    if (task instanceof Task) {
      return this.createNormalTaskElement(task);
    }
    throw new Error("couldn't match task type")
  }

  public renderTasks(tasksToDisplay: Task[]): void {
    while (this.taskListElement.firstChild) {
      this.taskListElement.firstChild.remove();
    }
    for (const task of tasksToDisplay) {
      const taskElement = this.createTaskElement(task);
      this.taskListElement.appendChild(taskElement);
    }
  }

  public disableDeadlineDateInputElement(): void {
    view.deadlineDateInputElement.setAttribute("disabled", "true");
  }
  public enableDeadlineDateInputElement(): void {
    view.deadlineDateInputElement.removeAttribute("disabled");
  }

  public hideDateErrorMessageElement(message?: string): void {
    if (message !== undefined) { this.setDateErrorMessage(message); }
    this.dateErrorMessageElement.setAttribute("class", "date-error-message hidden")
  }
  public exposeDateErrorMessageElement(message?: string): void {
    if (message !== undefined) { this.setDateErrorMessage(message); }
    this.dateErrorMessageElement.setAttribute("class", "date-error-message")
  }
  public setDateErrorMessage(message: string): void {
    this.dateErrorMessageElement.textContent = message;
  }
  public getDateErrorMessage(): string {
    const msg = this.dateErrorMessageElement.textContent;
    return msg ? msg : "";
  }

  public setTaskToCompleted(task: HTMLElement): void {
    task.setAttribute("class", "task completed");
  }
  public setTaskToMissed(task: HTMLElement): void {
    task.setAttribute("class", "task missed");
  }
}

const bindData = (view: View, viewModel: ViewModel) => {
  const callbacks = {
    completable: {
      eventType: "click",
      callback: (button: HTMLElement) => {
        return () => {
          viewModel.markTaskAsDone(button.id);
        };
      }
    },
    completableWithDeadline: {
      eventType: "click",
      callback: (button: HTMLElement) => {
        return () => {
          console.log("compwitded callback");
          viewModel.markTaskAsDone(button.id);
        };
      }
    },
    delete: {
      eventType: "click",
      callback: (button: HTMLElement) => {
        return () => {
          const title = button.id.split("-")[1];
          if (title === undefined) { throw new Error("title was undefined"); }
          console.log(title)
          viewModel.deleteTask(title);
        };
      }
    },
  }

  viewModel.eventListenerTasksToDisplay(() => {
    view.renderTasks(viewModel.tasksToDisplay);
  })

  viewModel.eventListenerTaskType(() => {
    if (viewModel.taskType === "deadlined") {
      view.enableDeadlineDateInputElement();
    } else {
      view.disableDeadlineDateInputElement();
    }
  })

  viewModel.eventListenerSaveable(() => {
    if (!viewModel.saveable) {
      if (!viewModel.validTitle(viewModel.title)) {
        view.exposeDateErrorMessageElement("• Title should be unique.");
      }
      if (viewModel.taskType === "deadlined") {
        if (!viewModel.date) {
          view.exposeDateErrorMessageElement("• Please enter a date.");
        } else {
          if (viewModel.date.getTime() <= new Date().getTime())
          view.exposeDateErrorMessageElement("• Date should be in a further date.");
        }
      }
    } else {
      view.hideDateErrorMessageElement("");
    }
  })

  view.eventListenerElementsToAddEventListenerTo(() => {
    if (view.elementsToAddEventListenerTo.length <= 0) { return; }
    const elementObj = view.elementsToAddEventListenerTo.pop();
    const element = elementObj?.element;
    if (element === undefined) { throw new Error("element was undefined"); }
    const subscript = elementObj?.behaviour;
    if (subscript === undefined) { throw new Error("subscript was undefined"); }
    const callbackObj = callbacks[subscript];
    element.addEventListener(callbackObj.eventType, callbackObj.callback(element));
  })

  // this was for deadlined tasks missing in real time, it could be implemented
  // better with event listners, i will not bother implementing for now
  // setInterval(() => {
  //   view.renderTasks(viewModel.tasksToDisplay);
  // }, 1000)

  view.titleInputElement.addEventListener("input", (event) => {
    viewModel.title = view.titleInputElement.value;
  })

  view.descriptionInputElement.addEventListener("input", (event) => {
    viewModel.description = view.descriptionInputElement.value;
  })

  view.addTaskButton.addEventListener("click", (event) => {
    viewModel.saveTask();
  })

  view.taskTypeFormElement.addEventListener("input", event => {
    switch (event?.target?.id) {
      case "normal-task-type-radio":
        viewModel.taskType = "normal";
        break;
      case "completable-task-type-radio":
        viewModel.taskType = "completable";
        break;
      case "deadlined-task-type-radio":
        viewModel.taskType = "deadlined";
        break;
      default:
        throw new Error("couldn't match event target id");
    }
  })

  view.deadlineDateInputElement.addEventListener("input", event => {
    viewModel.date = viewModel.valueToDate(view.deadlineDateInputElement.value);
  })

  view.deadlineDateInputElement.value = viewModel.dateToValue(viewModel.date);
}

const taskDataBase = new TaskDatabase(localStorage);
const view = new View();
const viewModel = new ViewModel(taskDataBase);

document.addEventListener("DOMContentLoaded", (event) => {
  bindData(view, viewModel);
})