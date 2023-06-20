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
    creationTime: Date,) {
      super(title, description, creationTime);
      this.isDone = false;
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
    deadline: Date) {
      super(title, description, creationTime);
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

    // public updateOngoing(): void {
    //   this.ongoing = this.checkOngoing();
    // }
}

class TaskDatabase {
  public tasks: Task[];

  constructor() {
    const creation = new Date()
    creation.setSeconds(creation.getSeconds() - 10);
    const deadline = new Date();
    deadline.setMinutes(deadline.getMinutes(), deadline.getSeconds() + 1);
    this.tasks = [
      new Task("jfdkslall", "jfkdlsaş", new Date()),
      new CompletableTask("completable task", "this is a completable task here.", new Date()),
      new CompletableTaskWithDeadline(
        "completable task with deadline", "this is a completable task here.", new Date(), deadline
      ),
    ];
  }

  add_task(task: Task): void {
    this.tasks.push(task);
  }

  get_tasks(): Task[] {
    return this.tasks;
  }

  get_a_task(taskTitle: string): Task {
    return this.tasks.filter(t => t.title === taskTitle)[0];
  }
}

// viewmodel
class ViewModel {
  private _title: string;
  private _description: string;
  private _tasksToDisplay: Task[];
  private taskDataBase: TaskDatabase;
  private eventTasksToDisplay: boolean;

  constructor(taskDataBase: TaskDatabase) {
    this.title = "";
    this.description = "";
    this.taskDataBase = taskDataBase;
    this.eventTasksToDisplay = false;
    this.fetchTasksToDisplay();
  }

  public get title(): string {
    return this._title;
  }
  public set title(title) {
    this._title = title;
    // this.callbacks["title"]();
  }
  public get description(): string {
    return this._description;
  }
  public set description(description) {
    this._description = description;
  }
  public get tasksToDisplay(): Task[] {
    this.fetchTasksToDisplay();
    return this._tasksToDisplay;
  }
  public set tasksToDisplay(tasksToDisplay) {

    // use the getter
    this._tasksToDisplay = tasksToDisplay;
  }

  public saveTask(): void {
    const task = new Task(this.title, this.description, new Date());
    this.taskDataBase.add_task(task);
    this.tasksToDisplay;
  }
  private fetchTasksToDisplay(): void {
    this._tasksToDisplay = this.taskDataBase.get_tasks();
    this.pingEventTasksToListen();
  }

  public eventListenerTasksToDisplay(callback: Function): void {
    setInterval(() => {
      if (this.eventTasksToDisplay) {
        callback();
        this.eventTasksToDisplay = !this.eventTasksToDisplay;
      }
    }, 50);
  }

  private pingEventTasksToListen(): void {
    this.eventTasksToDisplay = true;
  }

  public markTaskAsDone(taskTitle: string): void {
    const task = this.taskDataBase.get_a_task(taskTitle);
    if (!(task instanceof CompletableTask) && !(task instanceof CompletableTaskWithDeadline)) {
      return;
    }
    task.markAsDone();
    this.tasksToDisplay;
  }
}


class View {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public addTaskButton: HTMLButtonElement;
  public taskListElement: HTMLUListElement;
  public elementsToAddEventListenerTo: {
    element: HTMLElement, behaviour: "completable" | "completableWithDeadline"}[];

  constructor() {
    this.titleInputElement = document.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
    this.addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;
    this.taskListElement = document.querySelector(".task-list") as HTMLUListElement;
    this.elementsToAddEventListenerTo = [];
  }

  public createNormalTaskElement(task: Task): HTMLElement {
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

  public createCompletableTaskElement(task: CompletableTask): HTMLElement {
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
    } else {
      taskIsDoneElement.textContent = "Ongoing";
    }

    const taskMarkAsDoneButton = document.createElement("button");
    taskMarkAsDoneButton.setAttribute("class", "task-mark-as-done");
    taskMarkAsDoneButton.setAttribute("id", task.title);
    taskMarkAsDoneButton.textContent = "Mark As Done";
    this.elementsToAddEventListenerTo.push({element: taskMarkAsDoneButton, behaviour: "completable"});
    if (task.isDone)
      taskMarkAsDoneButton.setAttribute("disabled", "true");

    taskElement.appendChild(taskTitleElement);
    taskElement.appendChild(taskDescriptionElement);
    taskElement.appendChild(taskCreationDateElement);
    taskElement.appendChild(taskIsDoneElement);
    taskElement.appendChild(taskMarkAsDoneButton);

    return taskElement;
  }

  public createCompletableWithDeadlineTaskElement(task: CompletableTaskWithDeadline): HTMLElement {
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
    } else {
      if (!task.isOngoing()) {
        taskIsDoneElement.textContent = "Missed";
      } else {
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
      element: taskMarkAsDoneButton, behaviour: "completableWithDeadline"});

    taskElement.appendChild(taskTitleElement);
    taskElement.appendChild(taskDescriptionElement);
    taskElement.appendChild(taskCreationDateElement);
    taskElement.appendChild(taskIsDoneElement);
    taskElement.appendChild(taskMarkAsDoneButton);
    taskElement.appendChild(taskDeadlineDateElement);

    return taskElement;
  }

  public createTaskElement(task: Task): HTMLElement {
    if (task instanceof CompletableTaskWithDeadline) {
      return this.createCompletableWithDeadlineTaskElement(task);
    }
    if (task instanceof CompletableTask) {
      console.log("conple");
      return this.createCompletableTaskElement(task);
    }
    if (task instanceof Task) {
      console.log("fjdkslajşfdklsaş");
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
      console.log(task)
    }
  }
}

const bindData = (view: View, viewModel: ViewModel) => {
  const callbacks = {
    completable: {
      eventType: "click",
      callback: (button: HTMLElement) => {
        return () => {
          viewModel.markTaskAsDone(button.id);
        }
      }
    },
    completableWithDeadline: {
      eventType: "click",
      callback: (button: HTMLElement) => {
        return () => {
          viewModel.markTaskAsDone(button.id);
        }
      }
    }
  }

  viewModel.eventListenerTasksToDisplay(() => {
    view.renderTasks(viewModel.tasksToDisplay);
  })

  setInterval(() => {
    if (view.elementsToAddEventListenerTo.length > 0) {
      // const elementList = view.elementsToAddEventListenerTo;
      // for (const element of elementList) {
      const elementObj = view.elementsToAddEventListenerTo.pop();
      const element = elementObj?.element;
      // const subscript = element.className.replace(/-/gi, "_");
      const subscript = elementObj?.behaviour;
      const callbackObj = callbacks[subscript];
      element.addEventListener(callbackObj.eventType, callbackObj.callback(element));
      // }
    }
  }, 50)

  view.titleInputElement.addEventListener("input", (event) => {
    viewModel.title = view.titleInputElement.value;
  })

  view.descriptionInputElement.addEventListener("input", (event) => {
    viewModel.description = view.descriptionInputElement.value;
  })

  view.addTaskButton.addEventListener("click", (event) => {
    viewModel.saveTask();
  })

}

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
})