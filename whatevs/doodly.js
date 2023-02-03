// const arr = [12,21,28]
// const result = arr.map(element => element*element)
const arr = [[12,24],[21,15],[16,18]]
const result = arr.map(element => {
  return element.map(element => element*element)
})

function mat(firstDimension, secondDimension) {
  let mat = []
  for (let i = 0; i < firstDimension; i++) {
    mat.push([])
    for (let j = 0; j < secondDimension; j++) {
      mat[i].push(j + (secondDimension * i))
    }
  }
  return mat
}

// console.log(mat(5, 3))


function* range(start, end, skip) {
  skip = skip ? skip : 1
  for (let cur = start; cur < end; cur += skip) {
    yield cur
  }
}

function mat2(secondDimension, arr) {
  const firstDimension = Math.floor(arr.length / secondDimension)
  let mat = []
  for (let i = 0; i < firstDimension; i++) {
    mat.push(arr
      .slice(i * secondDimension, 
        i * secondDimension + secondDimension))
  }
  return mat
}

// console.log([1,2,3].slice(0,4))

const filledArr = Array
  .from(range(0, 26))
  
// console.log("fbodsa", mat2(3,filledArr))

// console.log(result)

const booba = filledArr
  .map(elm => elm + 1)
  .map(elm => {
    const arr = Array.from(range(0, elm))
    const foo = arr
      .map(elm => elm + 1)
      .map(elm => elm * elm)

    const bar = foo
      .filter(elm => elm % 2 === 0)
      .reduce((pre, cur) => pre + cur, 0)

    const goo = foo
      .filter(elm => elm % 2 !== 0)
      .reduce((pre, cur) => pre - cur, 0)

    return bar + goo
  })

console.log(booba)

console.log(
  booba.map((elm, ind, arr) => elm - arr[ind - 1])
)