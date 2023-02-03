class Task {
  constructor(textContent, id, date, isDone) {
    this.textContent = textContent
    this.id = id
    this.dateInMilliseconds = date
    this.date = Date(this.dateInMilliseconds)
    this.isDone = isDone
  }
}

function uniqueId(idList) {
  for (let iter = 1; iter < 1_000_000; iter++) {
    let randomId = Math.random().toString().slice(2, 8)
    if (!idList.includes(randomId)) {
      return randomId
    }
  }
}

function taskFactory(textContent, idList) {
  return new Task(textContent, uniqueId(idList), Date.now(), false)
}

// -----------------------------

class Model {
  constructor() {
    
    this.tasks = {}
  }

  taskFactoryForThis(textContent) {
    return taskFactory(textContent, this.getAllIds())
  }

  getAllIds() {
    return Object.keys(this.tasks)
  }

  addTask(textContent) {
    const taskToBeAdded = this.taskFactoryForThis(textContent)
    this.tasks[taskToBeAdded.id] = taskToBeAdded
    return this.tasks[taskToBeAdded.id]
  }

  deleteTask(id) {
    delete this.tasks[id]
  }

  arrayOfTaskIdsBasedOnDate() {
    return this.getAllIds()
      .sort((id1, id2) => this.tasks[id1].dateInMilliseconds - this.tasks[id2].dateInMilliseconds)
  }

  arrayOfTaskIdsThatAreMarkedAsDone() {
    return this.getAllIds()
      .filter(id => {
        return this.tasks[id].isDone
      })
  }

  markTaskAsDone(id) {
    this.tasks[id].isDone = true
  }
}

class View {
  constructor(model) {
    this.model = model

    this.colors = {
      unmarkedTaskBackgroundColor: "yellow",
      markedAsDoneTaskBackgroundColor: "#12e038",
    }

    // not up to date
    this.exampleToDoItem = `
      <li class="todo-item" id="${"insert-id-here"}">
        <div class="todo-item-text-container">
          <div class="todo-item-text-content">
            ${"insert text content here"}
          </div>
        </div>
        <div class="mark-as-done-button-container">
          <button class="mark-as-done-button">✔️</button>
          <button class="delete-button">❌</button>
        </div>
      </li>
    `

    this.generalDomObjects = {
      todoListContainer:  document.querySelector(".todo-list-container"),
      todoList:           document.querySelector(".todo-list"),
      taskAdderContainer: document.querySelector(".task-adder-container"),
      taskAdderInput:     document.querySelector(".task-adder-input"),
      addTaskButton:      document.querySelector(".add-task-button"),
    }
  }

  htmlIdFromId(id) {
    return "id-" + id
  }

  markAsDoneButtonId(id) {
    return "mark-as-done-button-id-" + id
  }

  deleteTaskButtonId(id) {
    return "delete-button-id-" + id
  }

  generateToDoListItemHtml(textContent, id) {
    const htmlId = this.htmlIdFromId(id)
    return `
      <li class="todo-item" id="${htmlId}">
        <div class="todo-item-text-container">
          <div class="todo-item-text-content">
            ${textContent}
          </div>
        </div>
        <div class="mark-as-done-button-container">
          <button class="mark-as-done-button" id="${this.markAsDoneButtonId(id)}">✔️</button>
          <button class="delete-button" id="${this.deleteTaskButtonId(id)}">❌</button>
        </div>
      </li>
    `
  }

  generateToDoListInnerHtml() {
    return this.model.arrayOfTaskIdsBasedOnDate()
      .reduce((first, second) => {
        return first + this.generateToDoListItemHtml(
          this.model.tasks[second].textContent,
          this.model.tasks[second].id
        )
      }, "")
  }

  getTaskAdderTextContent() {
    return this.generalDomObjects.taskAdderInput.value
  }

  resetTaskAdderTextContent() {
    this.generalDomObjects.taskAdderInput.value = ""
  }

  addEventListenerForAddTaskButton(context, callback) {
    callback = callback.bind(context)
    this.generalDomObjects.addTaskButton.addEventListener("click", callback)
  }

  addEventListenerForMarkAsDoneButton(context, callback, taskId) {
    callback = callback.bind(context)
    const selector = "#" + this.markAsDoneButtonId(taskId)
    const markAsDoneButtonHtmlElement = document.querySelector(selector)
    markAsDoneButtonHtmlElement.taskId = taskId
    markAsDoneButtonHtmlElement.addEventListener("click", callback)
  }

  addEventListenerForDeleteTaskButton(context, callback, taskId) {
    callback = callback.bind(context)
    const selector = "#" + this.deleteTaskButtonId(taskId)
    const deleteTaskButtonHtmlElement = document.querySelector(selector)
    deleteTaskButtonHtmlElement.taskId = taskId // to be able to use taskId as arg for callback
    deleteTaskButtonHtmlElement.addEventListener("click", callback)
  }

  markItemAsDone(id) {
    const selector = "#" + this.htmlIdFromId(id)
    document.querySelector(selector)
      .style.backgroundColor = this.colors.markedAsDoneTaskBackgroundColor
  }

  markAllDoneItemsAsDone() {
    this.model.arrayOfTaskIdsThatAreMarkedAsDone()
      .forEach(id => this.markItemAsDone(id))
  }

  getAllMarkAsReadButtonHtmlElements() {
    return this.model.getAllIds()
      .map(id => document.querySelector("#" + this.markAsDoneButtonId(id)))
      .filter(element => element)
  }

  getAllDeleteTaskButtonHtmlElements() {
    return this.model.getAllIds()
      .map(id => document.querySelector("#" + this.deleteTaskButtonId(id)))
      .filter(element => element)
  }

  renderToDoList() {
    this.generalDomObjects.todoList.innerHTML = this.generateToDoListInnerHtml()
    this.markAllDoneItemsAsDone()
  }
}

class Controller {
  constructor(model, view) {
    this.model = model
    this.view = view

    this.view.addEventListenerForAddTaskButton(this, this.addTaskCallback)
  }

  addTaskCallback() {
    // store id 
    const addedTask = this.model.addTask(this.view.getTaskAdderTextContent())
    this.view.resetTaskAdderTextContent()
    this.render()
    this.view.generalDomObjects.taskAdderInput.focus()
  }

  markAsDoneCallback(event) {
    this.model.markTaskAsDone(event.currentTarget.taskId)
    this.render()
  }

  deleteTaskCallback(event) {
    this.model.deleteTask(event.currentTarget.taskId)
    this.render()
  }

  addAllMarkAsDoneButtonEventListeners() {
    this.view.getAllMarkAsReadButtonHtmlElements()
      .forEach(element => {
        this.view.addEventListenerForMarkAsDoneButton(this, this.markAsDoneCallback, 
          // last 6 chars are the id
          element.id.slice(element.id.length - 6))
      })
  }

  addAllDeleteTaskButtonEventListeners() {
    this.view.getAllDeleteTaskButtonHtmlElements()
      .forEach(element => {
        this.view.addEventListenerForDeleteTaskButton(this, this.deleteTaskCallback, 
          element.id.slice(element.id.length - 6))
      })
  }

  deleteAllMarkAsDoneEventListeners() {
    this.view.getAllMarkAsReadButtonHtmlElements()
      .forEach(element => {
        element.removeEventListener("click", this.markAsDoneCallback)
      })
  }

  deleteAllDeleteButtonEventListeners() {
    this.view.getAllDeleteTaskButtonHtmlElements()
      .forEach(element => {
        element.removeEventListener("click", this.deleteTaskCallback)
      })
  }

  render() {
    this.deleteAllDeleteButtonEventListeners()
    this.deleteAllMarkAsDoneEventListeners()

    this.view.renderToDoList()

    this.addAllMarkAsDoneButtonEventListeners()
    this.addAllDeleteTaskButtonEventListeners()
  }
}

const model      = new Model()
const view       = new View(model)
const controller = new Controller(model, view)