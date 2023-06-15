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

const taskDataBase = new TaskDatabase();

// viewmodel
interface ViewModel {
  title: string;
  description: string;
  // deadline: Date;
  tasksToDisplay: Task[];
  addTask(): void;
  fetchTasks(): void;
  renderTasks(taskListElemnt: HTMLElement): void;
}

const viewModel: ViewModel = {
  // make getter setters
  title: "",
  description: "",
  tasksToDisplay: [],
  addTask(): void {
    const task = new Task(this.title, this.description, new Date(), null);
    taskDataBase.add_task(task);
  },
  fetchTasks(): void {
    this.tasksToDisplay = taskDataBase.get_tasks();
  },
  renderTasks(taskListElemnt: HTMLElement): void {
    while (taskListElemnt.firstChild) {
      taskListElemnt.firstChild.remove()
    }
    for (const task of viewModel.tasksToDisplay) {
      const taskElement = createTaskElement(task);
      taskListElemnt.appendChild(taskElement);
      console.log(task)
    }
  }
}

const createTaskElement = (task: Task): HTMLElement => {
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

const bindData = () => {
  // add task block
  const titleInputElement = document.querySelector("#title") as HTMLInputElement;
  const descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
  const addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;

  const taskListElement = document.querySelector(".task-list") as HTMLUListElement;

  titleInputElement.addEventListener("input", (event) => {
    viewModel.title = titleInputElement.value;
  })

  descriptionInputElement.addEventListener("input", (event) => {
    viewModel.description = descriptionInputElement.value;
  })

  addTaskButton.addEventListener("click", (event) => {
    viewModel.addTask();

    viewModel.fetchTasks();
    viewModel.renderTasks(taskListElement);
  })

  taskListElement.addEventListener("", (event) => {
    viewModel.fetchTasks();
    viewModel.renderTasks(taskListElement);
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  bindData();
})
