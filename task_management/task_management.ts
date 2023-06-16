// note: this is not real mvvm, a binder tool is required to achieve mvvm architecture

// model
class Task {
  constructor(
    public title: string, 
    public description: string,
    public creationTime: Date,
    public deadline: Date | null,
  ) {}
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
        console.log("event listened")
      }
    }, 50);
  }

  private pingEventTasksToListen(): void {
    console.log("pinged")
    this.eventTasksToDisplay = true;
    console.log(this.eventTasksToDisplay)
  }
}


class View {
  public titleInputElement: HTMLInputElement;
  public descriptionInputElement: HTMLInputElement;
  public addTaskButton: HTMLButtonElement;
  public taskListElement: HTMLUListElement;

  constructor() {
    this.titleInputElement = document.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
    this.addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;
    this.taskListElement = document.querySelector(".task-list") as HTMLUListElement;
  }

  public static createTaskElement(task: Task): HTMLElement {
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

  renderTasks(tasksToDisplay: Task[]): void {
    while (this.taskListElement.firstChild) {
      this.taskListElement.firstChild.remove();
    }
    for (const task of tasksToDisplay) {
      const taskElement = View.createTaskElement(task);
      this.taskListElement.appendChild(taskElement);
      console.log(task)
    }
  }
}


const bindData = (view: View, viewModel: ViewModel) => {
  viewModel.eventListenerTasksToDisplay(() => {
    view.renderTasks(viewModel.tasksToDisplay);
  })

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