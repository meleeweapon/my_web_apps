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
  public isDone: boolean;
  constructor(
    public title: string, 
    public description: string,
    public creationTime: Date,
    public deadline: Date | null,
  ) {
    this.isDone = false;
  }

  public markAsDone(): void {
    this.isDone = true;
  }
}

class TaskDatabase {
  public tasks: Task[];

  constructor() {
    this.tasks = [new Task("jfdkslall", "jfkdlsaş", new Date(), null)];
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
    const task = new Task(this.title, this.description, new Date(), null);
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
    task.markAsDone();
    this.tasksToDisplay;
  }
}


class View {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public addTaskButton: HTMLButtonElement;
  public taskListElement: HTMLUListElement;
  public elementsToAddEventListenerTo: HTMLElement[];

  constructor() {
    this.titleInputElement = document.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
    this.addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;
    this.taskListElement = document.querySelector(".task-list") as HTMLUListElement;
    this.elementsToAddEventListenerTo = [];
  }

  public createTaskElement(task: Task): HTMLElement {
    const taskElement = document.createElement("div");
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
    this.elementsToAddEventListenerTo.push(taskMarkAsDoneButton);

    taskElement.appendChild(taskTitleElement);
    taskElement.appendChild(taskDescriptionElement);
    taskElement.appendChild(taskCreationDateElement);
    taskElement.appendChild(taskIsDoneElement);
    taskElement.appendChild(taskMarkAsDoneButton);

    return taskElement;
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
    task_mark_as_done: {
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
      const element = view.elementsToAddEventListenerTo.pop();
      const subscript = element.className.replace(/-/gi, "_");
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