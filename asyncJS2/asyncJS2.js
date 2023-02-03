// instead of using event handlers like it's done in the previous chapter,
// use promises;

// const fetchPromise = fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")

// console.log(fetchPromise)

// fetchPromise.then((response) => {
//     console.log(`result of the premise: ${response}`)})

// console.log("started the promise")
// -----------------------------------------------------------

// but it can be written better,
// at each iteration, the code is improved:

// 1)
// async funcs are funcs that return promises,
// promises are objects.
// then() func can be used to handle promises.
// then() will pass the response to the callback func
// that's passed to it, which can then be used in the
// function body.
// other async funcs can be used in others.

// const fetchPromise = fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
// fetchPromise.then((response) => {
//     const jsonPromise = response.json()
//     jsonPromise.then((data) => {
//         console.log(data[0].name)
//     })
// })


// 2)
// this is starting to look like callback hell,
// to avoid this, promise chaining can be done.
// make the first then() return the promise that
// was returned from json(),
// so another then() can be called on it.

// const fetchPromise = fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
// fetchPromise
//     .then(response => response.json())
//     .then(data => {
//         console.log(data[0].name)
//     })


// 3)
// error handling can be added:

// const fetchPromise = fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
// fetchPromise
//     .then(response => {
//         // response.ok is true if the operation
//         // was completed successfully
//         if (!response.ok) {
//             throw new Error(`HTTP error: ${response.status}`)
//         }
//         return response.json()
//     })
//     .then(data => {
//         console.log(data[0].name)
//     })


// 4
// but error handling can be done better
// with catch() which can handle more than
// response.ok.
// catch() is called when the promise fails
// as opposed to then() which is called when
// the promise succeeds.
// if one catch() is added after the whole
// promise chain, it will catch any fail
// that may happen during the promise chain.
// only one catch can handle all the other
// async calls.
// in this example url is intentionally modified
// to fail.

// const fetchPromise = fetch("bad-scheme://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
//     .then(response => response.json())
//     .then(data => {
//         console.log(data[0].name)
//     })
//     .catch(error => {
//         console.log(`operation was not successfull: ${error}`)
//     })




// terminology of promises

// a promise can be in one of 3 states:
// pending  (not failed nor succeeded)
// fulfilled  (then() is called)
// rejected  (catch() is called)

// note: what failed or succeeded means
// is defined by the api.
// for example fetch() api considers
// a request SUCCESSFUL if the server
// returns an ERROR like 404 Not Found,
// but considers a request failed if the
// request is not sent because of a network
// error.

// settled means not pending, is used to
// cover both fulfilled and rejected
// a promise is resolved if it is settled,
// or if it has been "locked in" to follow
// the state of another promise.




// combining several promises:
// promises can be combined in different ways.
// one way was shown above, is called chaining.
// sometimes the async calls that need to be made
// don't depend on each other thus doesn't 
// require to be chained.
// in such case it's better to call them all
// at once and get notified when all are fulfilled.
// Promise.all() can do that taking an array of
// promises and returns a single promise.
// the promise returned by all() is fulfilled
// when and if all promises that are passed to
// it are fulfilled. the then() handler is called
// with an array of all the responses, in the same
// order they were passed to all().
// the promise returned by all() is rejected
// if any of the promises passed were rejected.
// catch() gets called with the error that was
// thrown by the promise that rejected.

// use these to successfully fetch:
const fetchPromise1 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json');
const fetchPromise2 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found');
const fetchPromise3 = fetch('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');

// use these to cause an error:
// const fetchPromise1 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json');
// const fetchPromise2 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found');
// const fetchPromise3 = fetch('bad-scheme://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');

Promise.all([fetchPromise1, fetchPromise2, fetchPromise3])
    .then(responses => {
        for (const response of responses) {
            console.log(`${response.url}: ${response.status}`)
        }
    })
    .catch(error => {
        console.error(`failed a fetch: ${error}`)
    })


// there is another Promise method whic is
// any(), mostly same as Promise.all() except
// instead of successfully fulfilling all
// passed promises, it cares about just one of
// them, doesn't care which one.
// it's fulfilled as soon as any of the passed
// promises is fulfilled.
// it's rejected if all of them are rejected.

const fetchPromise4 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json');
const fetchPromise5 = fetch('https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/not-found');
const fetchPromise6 = fetch('https://mdn.github.io/learning-area/javascript/oojs/json/superheroes.json');
Promise.any([fetchPromise4, fetchPromise5, fetchPromise6])
    .then(response => {
        console.log(`${response.url}: ${response.status}`)
    })
    .catch(error => {
        console.error(`failed a fetch: ${error}`)
    })





// async and await:

// async func declaration:
async function asyncFunc() {
    // this is an async function.
}

// refactor of the code before:
// async function fetchProducts() {
//     try {
//         const response = await fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
//         if (!response.ok) {
//             throw new Error(`HTML error: ${response.status}`)
//         }

//         const data = await response.json()
//         console.log(data[0].name)
//     }
//     catch (error) {
//         console.log(`couldn't get products: ${error}`)
//     }
// }
// fetchProducts()

// this way fetch can be used with await and it will
// return a fully completed Response instead of a Promise.
// this allows async code to be written as if it was synced.
// try and catch statement can be used to handle errors.
// note: async funcs return promises.
// code below is will not work:

// let promise = fetchProducts()
// console.log(promise[0].name)

// instead what needs to be done:

async function fetchProducts() {
    try {
        const response = await fetch("https://mdn.github.io/learning-area/javascript/apis/fetching-data/can-store/products.json")
        if (!response.ok) {
            throw new Error(`HTML error: ${response.status}`)
        }

        const data = await response.json()
        return data
    }
    catch (error) {
        console.log(`couldn't get products: ${error}`)
    }
}
let promise = fetchProducts()
promise
    .then(data => {
        console.log(data[0].name)
    })


// note: await keyword can only be used in
// async funcs, unless the code is in
// a js module.

// note: async funcs are better suited for
// promise chain style of operations, if
// the promises don't depend on each other
// Promise.all() will be more performant.
