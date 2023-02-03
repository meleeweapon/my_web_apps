const schulteTable = document.querySelector(".schulte-table")

const workingStates = {
  "working": 1,
  "paused": 2,
}

function handleForIntInput(input, defaultValue) {
    input = input === undefined ? defaultValue : input
    let inputInt = Math.floor(input)
    if (isNaN(inputInt)) {
      console.error(`Math.floor(inputInt) has resulted in NaN`)
    }
    return inputInt
}

class ChronometerForDisplay {
  // for display purposes
  // works in milliseconds
  constructor(customFunc, immediatelyStart, startTime, interval) {
    immediatelyStart = immediatelyStart === undefined ? true : immediatelyStart
    // if (immediatelyStart === undefined) {
    //   immediatelyStartFinal = true
    // } else {
    //   immediatelyStartFinal = immediatelyStart
    // }


    this.startTime = handleForIntInput(startTime, 0)
    this.passedTime = 0

    this.intervalInt = handleForIntInput(interval, 1000)
    this.currentSetintervalID = null


    this.customFunc = customFunc === undefined ? () => {} : customFunc

    if (immediatelyStart) { this.start() }
  }

  initiateAsync() {
    return setInterval(()=>{
      this.setTime(this.passedTime + this.intervalInt)
      this.customFunc(this)
      // console.log(this.getTime())
    }, this.getIntervalInt())
  }

  start() {
    this.workingState = workingStates.working
    this.currentSetIntervalID = this.initiateAsync()
  }

  end() {
    this.workingState = workingStates.paused
    clearInterval(this.currentSetIntervalID)
    this.currentSetIntervalID = null
  }

  getTime() { return this.startTime + this.passedTime }
  setTime(time) { this.passedTime = time }

  getIntervalInt() { return this.intervalInt }
  setIntervalInt(interval) { this.intervalInt = interval }

  getCustomFunc() { return this.getCustomFunc }
  setCustomFunc(func) { this.customFunc = func }

  // pause() {
  //   this.workingState = workingStates.paused
  //   clearInterval(this.currentSetIntervalID)
  //   this.currentSetIntervalID = undefined
  // }
}
// myClock = new ChronometerForDisplay()

class PreciseChronometer {
  constructor() {
    this.startTime = Date.now()
  }

  getTime() {
    return Date.now() - this.startTime
  }
}
// myPre = new PreciseChronometer()

class Chronometer {
  constructor(customFunc) {
    this.chronometerForDisplay = new ChronometerForDisplay(customFunc)
    this.preciseChronometer = new PreciseChronometer()
  }

  getPreciseTime() {
    return this.preciseChronometer.getTime()
  }
  
  getDisplayTime() {
    return this.chronometerForDisplay.getTime()
  }
}
const myCustomFuction = (displayChronometer) => {
  // console.log(displayChronometer.getTime())
}
const myChrono = new Chronometer(myCustomFuction)

document.querySelector("#pause-btn")
  .addEventListener("click", ()=>{
    myClock.pause()
  })
document.querySelector("#start-btn")
  .addEventListener("click", ()=>{
    myClock.start()
  })
document.querySelector("#get-precise-btn")
  .addEventListener("click", ()=>{
    console.log(
      // myPre.getTime(),
      myChrono.getPreciseTime(),
      myChrono.getDisplayTime()
    )
  })
//


const playingStates = {
  "playing": 1,
  "not playing": 2,
  "paused": 3,
  "initial pause": 4
}

class Game {
  constructor() {
    this.playingState = playingStates["initial pause"]
    this.chronometer = null
    
    this.progress = 0
    this.progressDestination = 25
  }

  initiateTable() {
    let finalHTML = ""
    for (let i = 0; i < 25; i++) {
      finalHTML += `<button id="${i}" class="table-cell" onclick="process(${i})">${i + 1}</button>`
    }

    schulteTable.innerHTML = finalHTML
  }

  // process(id) {
  //   if (this.progress >= this.progressDestination) {
  //     console.log("finish")
  //   } else {
  //     if (id === this.progress) {
  //       console.log("yes")
  //       this.process++
  //     } else {
  //       console.log("no")
  //     }
  //   }
  // }

  // reset() {}
}

function process(id) {
  if (id === myGame.progress) {
    console.log("yes")
    myGame.progress++
    console.log(myGame.progress)
    if (myGame.progress >= myGame.progressDestination) {
      console.log("finish")
    }
  } else {
    console.log("no")
  }
}

const myGame = new Game()
myGame.initiateTable()