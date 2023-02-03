const display = document.querySelector(".display")
const buttons = document.querySelector(".buttons")

const displayElements = {
  firstNumber: document.querySelector(".first-number"),
  operator: document.querySelector(".operator"),
  secondNumber: document.querySelector(".second-number"),
  equalsSign: document.querySelector(".equals-sign"),
  result: document.querySelector(".result"),
}; Object.freeze(displayElements)


const stages = {
  firstNumberStage: 1,
  operatorStage: 2,
  secondNumberStage: 3,
  resultStage: 4,
}; Object.freeze(stages)

class stagesFunctions {
  constructor(stagesObj, contextObj) {
    this[stagesObj.firstNumberStage] = function() {
      displayElements.firstNumber.textContent = contextObj.firstNumber
    }

    this[stagesObj.operatorStage] = function() {
      displayElements.firstNumber.textContent = contextObj.firstNumber
      displayElements.operator.textContent = contextObj.operator
    }

    this[stagesObj.secondNumberStage] = function() {
      displayElements.firstNumber.textContent = contextObj.firstNumber
      displayElements.operator.textContent = contextObj.operator
      displayElements.secondNumber.textContent = contextObj.secondNumber
    }

    this[stagesObj.resultStage] = function() {
      displayElements.firstNumber.textContent = contextObj.firstNumber
      displayElements.operator.textContent = contextObj.operator
      displayElements.secondNumber.textContent = contextObj.secondNumber
      displayElements.equalsSign.textContent = "="
      displayElements.result.textContent = contextObj.result
    }
  }
}

const operators = {
  add: 1,
  subtract: 2,
  multiply: 3,
  divide: 4,
  equals: 5
}

class displayObj {
  constructor() {
    this.firstNumber = 0
    this.secondNumber = 0
    this.operator = null
    this.result = 0
    this.stage = stages.firstNumberStage

    this.stagesFunctionsObj = new stagesFunctions(stages, this)
    Object.freeze(this.stagesFunctionsObj)
  }

  add() {
    if (this.stage === stages.firstNumberStage) {
      this.operator = operators.add
    }
  }

  appendDigit(digit) {
    if (this.stage === stages.firstNumberStage) {
      let result = this.firstNumber.toString() + digit.toString()
      result = parseInt(result)
      this.firstNumber = result
    } else if (this.stage === stages.secondNumberStage) {
      let result = this.secondNumber.toString() + digit.toString()
      result = parseInt(result)
      this.secondNumber = result
    }
    
  }

  resetDisplay() {
    displayElements.firstNumber.textContent  = ""
    displayElements.operator.textContent     = ""
    displayElements.secondNumber.textContent = ""
    displayElements.equalsSign.textContent   = ""
    displayElements.result.textContent       = ""
  }

  executeStateFunction(stage) {
    this.stagesFunctionsObj[stage]()
  }

  executeCurrentStateFucntion() {
    this.executeStateFunction(this.stage)
  }

  renderDisplay() {
    this.resetDisplay()

    // use this instead of switch
    this.executeCurrentStateFucntion()
  }

  performResult() {
    // if (this.operator === "+") {
    //   this.result = this.firstNumber + this.secondNumber
    // }
    switch (this.operator) {
      case "+":
        this.result = this.firstNumber + this.secondNumber
        break
      case "-":
        this.result = this.firstNumber - this.secondNumber
        break
      case "*":
        this.result = this.firstNumber * this.secondNumber
        break
      case "/":
        this.result = this.firstNumber / this.secondNumber
        break
    }
  }
}

const theDisplayObj = new displayObj()


const operatorQueriesToStrings = {
  ".add": "+",
  ".subtract": "-",
  ".multiply": "*",
  ".divide": "/",
}; Object.freeze(operatorQueriesToStrings)

function setAllOperatorEventListeners(operatorQueryToStringObj) {
  Object.keys(operatorQueryToStringObj).forEach(key => {
    document.querySelector(key).addEventListener("click", ()=>{
      if (theDisplayObj.stage === stages.firstNumberStage) {
        theDisplayObj.operator = operatorQueryToStringObj[key]
        theDisplayObj.stage = stages.operatorStage
      } else if (theDisplayObj.stage === stages.resultStage) {
        theDisplayObj.operator = operatorQueryToStringObj[key]
        theDisplayObj.firstNumber = theDisplayObj.result
        theDisplayObj.secondNumber = 0
        theDisplayObj.stage = stages.secondNumberStage
      }
      theDisplayObj.renderDisplay()
    })
  })
}

setAllOperatorEventListeners(operatorQueriesToStrings)

document.querySelector(".equals").addEventListener("click", ()=>{
  if (theDisplayObj.stage === stages.secondNumberStage) {
    theDisplayObj.performResult()
    theDisplayObj.stage = stages.resultStage
  }
  theDisplayObj.renderDisplay()
})

document.querySelector(".clear").addEventListener("click", ()=>{
  theDisplayObj.firstNumber = 0
  theDisplayObj.secondNumber = 0
  theDisplayObj.operator = null
  theDisplayObj.result = 0
  theDisplayObj.stage = stages.firstNumberStage
  theDisplayObj.renderDisplay()
})

function stringKeyToDigitValueObj(keysArr) {
  const resultObj = {}
  for (let digit = 0; digit < 10; digit++) {
    resultObj[keysArr[digit]] = digit
  }
  return resultObj
}

const allDigitQueriesArr = [
  ".zero",
  ".one",
  ".two",
  ".three",
  ".four",
  ".five",
  ".six",
  ".seven",
  ".eight",
  ".nine",
]

const allDigitQuerySToNumber = stringKeyToDigitValueObj(allDigitQueriesArr)
Object.freeze(allDigitQuerySToNumber)

function allDigitsEventListeners(digitQueryToNumberObj) {
  Object.keys(digitQueryToNumberObj).forEach(key => {
    digitEventListener(key)
  })
}

function digitEventListener(querySelect) {
  document.querySelector(querySelect).addEventListener("click", ()=>{
    if (theDisplayObj.stage === stages.firstNumberStage) {
      theDisplayObj.appendDigit(allDigitQuerySToNumber[querySelect])
    } else if (theDisplayObj.stage === stages.operatorStage
      || theDisplayObj.stage === stages.secondNumberStage) {
      theDisplayObj.stage = stages.secondNumberStage
      theDisplayObj.appendDigit(allDigitQuerySToNumber[querySelect])
    }
    theDisplayObj.renderDisplay()
  })
}

allDigitsEventListeners(allDigitQuerySToNumber)