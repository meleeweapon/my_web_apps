// mdn web docs, intro to async

function greet(name) {
    return `Hello ${name}, hope you're doing well!`
}

const name = "foobar"
const greeting = greet(name)
console.log(greeting)
// ---------------------------------------------------

const MAX_PRIME = 1_000_000


function isPrimeSlower(num) {
    if (num < 2)   { return false }
    if (num === 2) { return true }

    for (let x = 2; x < Math.sqrt(num); x++) {
        if (num % x === 0) {
            return false
        }
    }
    return true
}

function isPrime(num) {
    // const lim = Math.sqrt(num)
    for (let x = 2; x < Math.sqrt(num); x++) {
        if (num % x === 0) {
            return false
        }
    }
    return num > 1
}

function generatePrimes(lim) {
    let result = []
    for (let x = 2; x < lim; x++) {
        if (isPrimeSlower(x)) {
            result.push(x)
        }
    }
    return result
}

const random = max => Math.floor(Math.random() * max)


// this is a synchronous func.
// if run, user won't be able to interact with
// the site until the execution is over
function generatePrimesGoofy(lim) {
    let result = []
    while (result.length < lim) {
        let ran = random(MAX_PRIME)
        if (isPrimeSlower(ran)) {
            result.push(ran)
        }
    }
    return result
}


// callback functions can get out of hand when dealing with
// callback chains, which form when callback funcs have to call
// funcs that accept other callback funcs
// example:

// sync version:
function step1(init) {
    return init + 1
}

function step2(init) {
    return init + 2
}

function step3(init) {
    return init + 3
}

function doSteps(init) {
    let result = init
    result = step1(result)
    result = step2(result)
    result = step3(result)
    console.log(result)
}
doSteps(0)


// async version:
function asyncStep1(init, callback) {
    const result = init + 1
    callback(result)
}

function asyncStep2(init, callback) {
    const result = init + 2
    callback(result)
}

function asyncStep3(init, callback) {
    const result = init + 3
    callback(result)
}

// this not really async, this is just 
// for demonstration purposes.
// a trivial task results in 
// complicated code.
function asyncDoSteps(init) {
    asyncStep1(init, (result1) => {
        asyncStep2(result1, (result2) => {
            asyncStep3(result2, (result3) => {
                console.log(result3)
            })
        })
    })
}
asyncDoSteps(0)

// ---------------------------------------------------------

// event handlers are a type of callback functions
// they can be use to wrote async code
const log = document.querySelector('.event-log');

document.querySelector('#xhr').addEventListener('click', () => {
  log.textContent = '';

  const xhr = new XMLHttpRequest();

  // instead of listening to "click" event, we make it listen to
  // "loeadend" event, it's called whenever that event happens
  xhr.addEventListener('loadend', () => {
    log.textContent = `${log.textContent}Finished with status: ${xhr.status}`;
  });

  xhr.open('GET', 'https://raw.githubusercontent.com/mdn/content/main/files/en-us/_wikihistory.json');
  xhr.send();
  log.textContent = `${log.textContent}Started XHR request\n`;
});

document.querySelector('#reload').addEventListener('click', () => {
  log.textContent = '';
  document.location.reload();
});




const quota = document.querySelector("#quota")
const output = document.querySelector("#output")

document.querySelector("#generate_btn").addEventListener("click", () => {
    // call the generate func
    let lim = quota.value
    let intLim = undefined
    if (parseInt(lim)) {
        intLim = parseInt(lim)
    } else {
        console.error("parse error")
    }
    generatePrimesGoofy(intLim)

    // display the result
    output.innerHTML = `Generated ${intLim} primes.`
})

document.querySelector("#reload_btn").addEventListener("click", () => {
    document.location.reload()
})