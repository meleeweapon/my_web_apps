// p1 is RESOLVED when created
// because resolveOuter is called synchronously.
// but resolveOuter is resolved with another
// promise so p1 is FULFILLED after 3 secs.
const p1 = new Promise((resolveOuter) => {
  console.log("this part is called synchronously")
  resolveOuter(
    new Promise((resolveInner) => {
      console.log("this get's called even if p1 is not used with then()")
      setTimeout(()=>{
        resolveInner("this part is called asyncly")
      }, 3000);
    })
  );
});
p1.then(x => {
    console.log("first")
    console.log(x)
    return x
})

// then(), catch() and finally() all return a promise
// which means they can be chained.
// then() method takes 2 arguments, first argument is
// a callback func for when the promise is fulfilled,
// the second is for when the promise is rejected.
// note: catch() is just a then() with the first
// argument absent.
const myPromise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("foo");
  }, 1000);
});

// when it's not necessary to handle an error
// immediately, there is no need to use the
// then's second argument.
// an example using arrow funcs:
myPromise
  .then(x => `${x} and bar`)
  .then(x => `${x} and foo`)
  .then(x => `${x} or foo`)
  .then(x => `${x} or bar`)
  .then(x => {
    console.log(x)
  })
.catch(x => {
console.error(x)
})

// note: above is just for demonstration,
// optimally all synchronous actions should
// be done in one handler. more handlers
// take more ticks to execute.


// more examples
const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p2 result")
    }, Math.floor(Math.random() * 2000));
})

p2.then(x => {
    console.log(x)
})



// inefficient prime number solver
const MAX_PRIME = 1_000_000
function isPrime(num) {
    for (let x = 2; x < Math.sqrt(num); x++) {
        if (num % x === 0) { return false } }
    return num > 1 }
const random = max => Math.floor(Math.random() * max)
function generatePrimesGoofy(lim) {
    let result = []
    while (result.length < lim) {
        let ran = random(MAX_PRIME)
        if (isPrime(ran)) { result.push(ran) } }
    return result}

let isPrimePromise = function(num) {
    return new Promise((resolve, reject) => {
        for (let x = 2; x < Math.sqrt(num); x++) {
            if (num % x === 0) { return false } }
        return num > 1 
    })
}

// let generatePrimesPromise = new Promise((resolve, reject) => {
//     let result = []
//     while (result.length < 1000000) {
//         let ran = random(MAX_PRIME)
//         if (isPrimePromise(ran).then(x => x)) { result.push(ran) }
//     }
//     resolve(result)
// })

// generatePrimesPromise.then(x => {
//     console.log("found the primes")
// })


let test = new Promise((then, catchF) => {
    if (Math.random() > 0.5) {
        then("awooga")
    } else {
        catchF("booba")
    }
})
test.then(x => {console.log(x)}).catch(x => console.log(x))


let sum = 0
let add1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        sum += 1
        resolve(sum + 1)
    }, Math.floor(Math.random() * 1000));
})
let add2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        sum += 2
        resolve(sum + 2)
    }, Math.floor(Math.random() * 1000));
})
let add3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        sum += 3
        resolve(sum + 3)
    }, Math.floor(Math.random() * 1000));
})
Promise.all([add1, add2, add3])
.then(() => {
    console.log(sum)
})


