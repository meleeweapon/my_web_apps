const passIn = (vari) => {
  if (vari.valid) return vari.value
  return false
}

const numberPassIn = passIn({
  valid: true,
  value: 2,
})

const anotherNumberPassIn = passIn({
  valid: true,
  value: 3,
})


const passInWithPredefined = (value) => {
  return (otherValue) => {
    return passIn(Object.assign(
      {},
      value,
      otherValue,
    ))
  }
}

const passInAsValid = passInWithPredefined({valid: true})

const x = passInAsValid({value: 4})
const y = passInAsValid({value: 5})
// console.log(x)
// console.log(y)

// =====================================================


const partial = (func, ...preArg) => {
  return (...arg) => {
    return func(...preArg, ...arg)
  }
}

const addAlt = (x, y) => x + y
const add3 = partial(addAlt, 3)
// console.log(add3(3))

const passIn2 = (defaults, vari) => {
  vari = Object.assign({}, defaults, vari)
  if (vari.valid) return vari.value
  return false
}

const passInAsValid2 = partial(passIn2, {valid: true})

// console.log(passInAsValid2({value: 12}))

// =====================================================


const addCurried = x => y => x + y
// console.log(addCurried(4)(3))

const passInCurried = defaults => vari => {
  vari = Object.assign({}, defaults, vari)
  if (vari.valid) return vari.value
  return false 
}

const validPassIn = passInCurried({valid: true})
// console.log(validPassIn({value: "awooga"}))
// console.log(validPassIn({value: "bababoey"}))

// =====================================================

// mock
const request = defaults => options => {
  options = Object.assign({}, defaults, options)
  return new Promise((resolve, reject) => {
  setTimeout(() => {
    if (options.headers["Custom"] !== "key") {
      reject(Error("didn't get expected headers"))
    }

    resolve([
      {price: 3},
      {price: 5},
      {price: 15},
    ])
  }, 1000)
})

}


const map = fn => arr => arr.map(fn)
const multiply = x => y => x * y
const pluck = key => object => object[key]
const reduce = fn => arr => arr.reduce(fn)

const discount = multiply(0.98)
const tax = multiply(1.0925)

const customRequest = request({
  headers: {"Custom": "key"}
})

customRequest({url: "cart/items"})
  .then(map(pluck("price")))
  .then(map(discount))
  .then(map(tax))
  .then(reduce((x, y) => x + y))
  .then((result) => console.log(result))

// customRequest({url: "cart/items"})
//   .then((result) => {
//     return result.map(pluck("price"))
//       .map(discount)
//       .map(tax)
//       .reduce((x, y) => x + y)
//   })
//   .then((result) => console.log(result))

// customRequest({url: "cart/items"})
//   .then((result) => {
//     return result.map(item => {
//       return tax(discount(pluck("price")(item)))
//     })
//       .reduce((x, y) => x + y)
//   })
//   .then((result) => console.log(result))

// customRequest({url: "cart/items"})
//   .then(result => result.reduce(
//     (x, y) => x + tax(discount(pluck("price")(y)))
//     , 0))
//   .then(result => console.log(result))

// =====================================================

const hyphenate = string => string.slice(0, string.length / 2)
  + "-"
  + string.slice(string.length / 2)

const toUpperCase = string => string.toUpperCase()

const reverse = arr => [...arr].reverse()

const compose = (...funcs) => initialArg =>
  reverse(funcs).reduce((arg, func) => func(arg), initialArg)


const processWords = compose(hyphenate, reverse, toUpperCase)
const words = [
  "hello", "functional", "programming"
]
const newWords = words.map(processWords)
console.log(newWords)

// =====================================================

customRequest({url: "cart/items"})
  .then(map(
    compose(
      tax,
      discount,
      pluck("price"),
    )
  ))
  .then(reduce((x, y) => x + y))
  .then((result) => console.log(result))

// =====================================================

const factorial = x => {
  if (x < 1) return 1
  return x * factorial(x - 1)
}

const factorialAlt = (x, accumulator = 1) => {
  if (x < 1) return accumulator
  return factorialAlt(x - 1, accumulator * x)
}

console.log(factorial(5))

// this won't work anymore
// console.log(factorialAlt(100000))