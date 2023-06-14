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
    this.tasks = [];
  }

  add_task(task: Task) {
    this.tasks.push(task);
  }
}

const taskDataBase = new TaskDatabase();

// viewmodel
interface ViewModel {
  title: string;
  description: string;
  // deadline: Date;
  addTask(): void;
}

const viewModel: ViewModel = {
  title: "",
  description: "",
  addTask(): void {
    const task = new Task(this.title, this.description, new Date(), null);
    taskDataBase.add_task(task);
  }
}

const bindData = () => {
  const titleInputElement = document.querySelector("#title") as HTMLInputElement;
  const descriptionInputElement = document.querySelector("#description") as HTMLInputElement;
  const addTaskButton = document.querySelector("#add-task") as HTMLButtonElement;

  titleInputElement.addEventListener("input", (event) => {
    viewModel.title = titleInputElement.value;
  })

  descriptionInputElement.addEventListener("input", (event) => {
    viewModel.description = descriptionInputElement.value;
  })

  addTaskButton.addEventListener("click", (event) => {
    viewModel.addTask();
  })
}

document.addEventListener("DOMContentLoaded", (event) => {
  bindData();
})