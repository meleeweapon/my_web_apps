const f = Math.floor

document.querySelector("body")
  .style
  .backgroundColor = "black"

const canvasWidth = 1300
const canvasHeight = 600
document
  .querySelector("body")
  .innerHTML = `<canvas 
    id="canvas" 
    width="${canvasWidth}" 
    height="${canvasHeight}">
    </canvas>` 
    + document
      .querySelector("body")
      .innerHTML

class Vector2d {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}
const v2 = Vector2d

function drawRectangle(center, width, height, color = c.fillStyle) {
  const x = center.x - Math.floor(width / 2)
  const y = center.y - Math.floor(height / 2)
  c.fillStyle = color
  c.fillRect(x, y, width, height)
}
const drawRect = drawRectangle

function drawBox(center, sideLength, color = c.fillStyle) {
  drawRect(center, sideLength, sideLength, color)
}

function fillRect2(upperLeft, lowerRight, color = c.fillStyle) {
  c.fillStyle = color
  c.fillRect(upperLeft.x, 
    upperLeft.y, 
    lowerRight.x - upperLeft.x, 
    lowerRight.y - upperLeft.y)
}

// function drawBox(center, sideLength) {
//   Math.floor(sideLength / 2)
//   const x = center.x - Math.floor(sideLength / 2)
//   const y = center.y - Math.floor(sideLength / 2)
//   c.fillRect(x, y, sideLength, sideLength)
// }

const canvas = document.querySelector("#canvas")
const canvasContext = canvas.getContext("2d")
const c = canvasContext
c.fillStyle = "black"
c.fillRect(200, 200, 200, 200)

c.fillStyle = "red"
const v = new v2(300, 150)
drawBox(v, 100)
// c.moveTo(250, 100)
// c.lineTo(350, 200)
// c.stroke()

drawRect(new v2(400, 400), 200, 100, "cyan")

const groundY = 500

function scene(y) {
  const otherGrid = c.createLinearGradient(0, y, 0, canvasHeight)
  otherGrid.addColorStop(0, "#168221")
  otherGrid.addColorStop(1, "#105917")
  fillRect2(new v2(0, y), 
    new v2(canvasWidth, canvasHeight), 
    otherGrid)

  const grid = c.createLinearGradient(0, y, 0, 100)
  // grid.addColorStop(0, "#c2f7ff")
  // grid.addColorStop(1, "#4cbcfc")

  grid.addColorStop(0, "#de4328")
  grid.addColorStop(1, "#b56b26")
  c.fillStyle = grid
  fillRect2(new v2(0, 0),
    new v2(canvasWidth, y)),
    grid
  
  c.moveTo(0, y)
  c.lineTo(canvasWidth, y)
  c.stroke()
}
const sceneDefault = ()=>{scene(groundY)}
sceneDefault()


class Box{
  constructor(center, sideLength) {
    this.center = center
    this.sideLength = sideLength
    const halfSideLen = Math.floor(sideLength / 2)
    this.upperSide = center.y - halfSideLen
  }

  draw(color) {
    drawBox(this.center, this.sideLength, color)
  }

  setCenter(v2) {
    this.center = v2
  }
}

let globalGravity = new v2(0, 1)

class RigidBody {
  constructor(shape, graivtyV2) {
    this.shape = shape
    this.velocity = new v2(0, 0)
    this.acceleration = new v2(0, 0)

    if (typeof(graivtyV2) === "number") {
      graivtyV2 = new v2(0, graivtyV2)
    }
    this.gravity = graivtyV2 === undefined ? globalGravity : graivtyV2

    this.onGround = false
  }

  applyAcceleration() {
    this.velocity = addV2(this.velocity, this.acceleration)
  }

  applyVelocity() {
    this.shape.center = addV2(this.shape.center, this.velocity)
  }

  applyGravity() {
    this.velocity = addV2(this.velocity, this.gravity)
  }

  addAcceleration(v2) {
    this.acceleration = addV2(this.acceleration, v2)
  }

  setGravity(v2) {
    this.gravity = v2
  }
}

const bohks = new Box(new v2(600, 300), 100)
bohks.draw("blue")

const theBohks = new RigidBody(bohks, 0.5)

function addV2(first, second) {
  return new v2(first.x + second.x, first.y + second.y)
}


let arrowUpKeyPressed = false
document.addEventListener('keyup', (e) => {
  if (e.code === "ArrowUp") {
    arrowUpKeyPressed = true
  }
  // else if (e.code === "ArrowDown") playerSpriteX -= 10
});
let jump = false

const fpsCounter = document.querySelector("#fps-counter")

let deltaTime;
let start, previousTimeStamp;

function step(timestamp) {
  // this is probably redundant but idk
  if (start === undefined) {
    start = timestamp;
  }
  const elapsed = timestamp - start;

  // this if is probably redundant but idk
  if (previousTimeStamp !== timestamp) {
    // Math.min() is used here to make sure the element stops at exactly 200px
    // const count = Math.min(0.1 * elapsed, 200);
    // element.style.transform = `translateX(${count}px)`;

    if (arrowUpKeyPressed) {
      arrowUpKeyPressed = false
      jump = true
    }


    theBohks.applyAcceleration()
    theBohks.applyGravity()
    theBohks.applyVelocity()

    if (theBohks.onGround) {
      theBohks.velocity = new v2(theBohks.velocity.x, 0)
      theBohks.shape.center = new v2(theBohks.shape.center.x
        , groundY - theBohks.shape.sideLength / 2 )
      
      if (jump) {
        theBohks.onGround = false
        theBohks.velocity
          = new v2(theBohks.velocity.x
            , theBohks.velocity.y - 10)
        jump = false
      }
      
    } else {
      if (jump) {
        jump = false
      }

      if (theBohks.shape.center.y + theBohks.shape.sideLength / 2 > groundY) {
        theBohks.onGround = true
        theBohks.velocity = new v2(theBohks.velocity.x, 0)
        theBohks.shape.center = new v2(theBohks.shape.center.x
          , groundY - theBohks.shape.sideLength / 2 )
      }
    }

    sceneDefault()
    bohks.draw("blue")

    deltaTime = timestamp - previousTimeStamp
    fpsCounter.textContent = Math.floor(1000 / deltaTime)
  }

  previousTimeStamp = timestamp;
  window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);
