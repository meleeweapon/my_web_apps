const canvasWidth = 1300
const canvasHeight = 600
const rootNode = document.querySelector("body")

class Model {
  constructor() {

  }
}

class View {
  constructor(canvasWidth, canvasHeight, rootNode) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight
    this.rootNode = rootNode
    this.canvasNode = this.appendCanvas(this.rootNode)
    this.context = this.canvasNode.getContext("2d")
  }

  appendCanvas(rootNode) {
    const canvasNode = this.createCanvas(this.canvasWidth, this.canvasHeight)
    rootNode.appendChild(canvasNode)
    return canvasNode
  }

  createCanvas(width, height) {
    const canvasNode = document.createElement("canvas")
    canvasNode.setAttribute("id", "canvas")
    canvasNode.setAttribute("width", width.toString())
    canvasNode.setAttribute("height", height.toString())
    return canvasNode
  }
}

class Presenter {
  constructor(model, view) {
    this.model = model
    this.view = view
  }
}


const model = new Model()
const view = new View(canvasWidth, canvasHeight, rootNode)
const presenter = new Presenter(model, view)

presenter.view.context.fillStyle = "white"
presenter.view.context.fillRect(200, 200, 200, 200)