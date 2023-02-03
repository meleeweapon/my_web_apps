// source: haskell for js devs, tsoding

// js has functional qualities but isn't a functional programming language
// just for a thought experiment, it can be tried to write purely functional code in js

// functional programming has some restrictions:
//   no loops
//   no if statements (ternary operations are allowed though)
//   no side effects
//   no arrays
//   objects can be used
//   functions can only have 0 or 1 arguments
//   function body must consist of a single return statement
//   no assignment in function bodys



// more than 1 argument
// function body doesn't consist of a single return statement
// assignment to a variable
// potential side effects
function imperativeAdd(a, b) {
    let result = a + b;
    return result;
}

// console log isn't purely functional, it has side effects;
// but for demonstration purposes it can be used
console.log("imperative add: ", 
    imperativeAdd(1, 2)
);


// to satisfy the "0 or 1 argument" rule;
// write a func that takes the first arg and 
// returns another func that takes the second arg
// and returns the sum of them
function functionalAdd(a) {
    return function(b) {
        return a + b;
    }
}

// to make it look a bit better;
const functionalAddShorter = a => b => a + b;

// it looks a bit unconventional when calling;
console.log("functional add: ", 
    // immediately call the func that the first func returns
    functionalAdd(1)(2)
);

console.log("functional add shorter: ", 
    functionalAddShorter(1)(2)
);

// --------------------------------------------------------------

// write a func that sums all number from 0 to x

// to satisfy "no loops" rule use recursion
// to satisfy "no if's" rule use ternary
const sumUpTo = x => x > 0 ? x + sumUpTo(x - 1) : 0;

// to make it more clear here's the longer version
const sumUpToLonger = (x) => {
    // if x is bigger than 0 return x + sum(x - 1) 
    // if x is 0 then return 0
    return (x > 0) ? (x + sumUpToLonger(x - 1)) : (0);
}

console.log("sum up to: ", 
    sumUpTo(10)
);

// --------------------------------------------------------------

// instead of arrays fp uses functional lists
// functional lists consist of pairs
// pair construction implementation

//a pair consist of two values, i'll name those two as 
// head and tail but it can be anything
const pair = a => b => {return {head: a, tail: b}};

console.log("pair 1: ",
    pair(932)(120)
)


// then a functional list can easily be constructed
// a fl with one value: pair(8)(null)
// this pair paired with another value:
// pair(12)( pair(8)(null) )
// the tail of the second pair is the first pair itself
console.log("functional list 1: ",
    pair(0)( pair(1)( pair(2)( pair(3)(null) ) ) )
);

// note that an empty fl is null


// pairs fundamentally have 3 functions:
// construct: implemented
// head
// tail

const head = pair => pair.head;
const tail = pair => pair.tail;

console.log("head of fl1: ",
    head(pair(0)( pair(1)( pair(2)( pair(3)(null) ) ) )),
);
console.log("tail of fl1: ",
    tail(pair(0)( pair(1)( pair(2)( pair(3)(null) ) ) ))
);


// for better inspection of fl, 
// impl of convert fl to array
const functionalListToArray = (fl) => {
    let result = [];
    while (fl !== null) {
        result.push(head(fl));
        fl = tail(fl);
    }
    return result;
}

console.log("fl to arr 1",
    functionalListToArray(pair(0)( pair(1)( pair(2)( pair(3)(null) ) ) ))
);



// it's easier to construct an array
// so a func that takes an arr and
// returns a fl would be convenient

const arrayToFunctionalList = (arr) => {
    let fl = null;
    // alternatively;
    // arr.reverse()
    // for (let x = 0; x < arr.length; x++)
    for (let x = arr.length - 1; x >= 0; x--) {
        fl = pair(arr[x])(fl);
    }
    return fl;
}


console.log("arr to fl: ",
    arrayToFunctionalList([0,1,2,3])
);

// works for strings too
console.log("str to fl: ",
    arrayToFunctionalList("foobar")
);

// --------------------------------------------------------------

// solve fizzbuzz

const fizz = num => num % 3 === 0 ? "fizz" : "";
const buzz = num => num % 5 === 0 ? "buzz" : "";
const fizzBuzz = num => fizz(num) + buzz(num);


console.log("fizzbuzz: ",
    fizzBuzz(15)
);

// generate from 1 to 100
const range = from => to => 
    from < to 
    ?  pair(from)(range(from + 1)(to)) 
    : null;

console.log("range: ",
    functionalListToArray(
    range(1)(100))
);


// not very clear when written as a single line
// const fizzBuzzFromfl = list => list !== null ?  pair (pair (head(list)) (fizzBuzz(head(list)))) (fizzBuzzFromfl(tail(list))) : null;

// with indents to make it more clear;
const fizzBuzzFromfl = list => 
    list !== null 
    ? pair
        (pair
            (head(list))
            (fizzBuzz(head(list))))
        (fizzBuzzFromfl(tail(list))) 
    : null;

console.log("fizzBuzz 1 through 100: ",
    functionalListToArray(
    fizzBuzzFromfl(
    range(1)(100)))
);


// different approach;

const map = func => list =>
    list !== null
    ? pair
        (func(head(list)))
        (map(func)(tail(list)))
    : null;

console.log("fizzBuzz 1 through 100 unpaired: ",
    functionalListToArray(
    map(fizzBuzz)(range(1)(100)))
);

const zip = list1 => list2 => 
    list1 !== null && list2 !== null
    ? pair
        (pair
            (head(list1))
            (head(list2))
        )
        (zip(tail(list1))(tail(list2)))
    : null;

const zipMap = func => list1 => 
    zip(list1)(map(func)(list1));


console.log("fizzBuzz 1 through 100 again: ",
    functionalListToArray(
    zipMap(fizzBuzz)(range(1)(100)))
);


// previous solutions are for thought exps, here's the final solution;
const fizzBuzzFinal = num => 
    ((num % 3 === 0 ? "fizz" : "") + (num % 5 === 0 ? "buzz" : "")) || num;
    // the or operator returns the first value if the first value is truthy,
    // otherwise returns the second value, for more info search: js logical or operator

console.log("final fizzBuzz: ",
    functionalListToArray(
    map(fizzBuzzFinal)(range(1)(100)))
)