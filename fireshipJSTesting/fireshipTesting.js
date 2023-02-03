// variable x now lives on the heap rather than stack
let giveMeAClosure = () => {
    let x = 69;
    return () => {
        x--;
        return x;
    }
}

let myClosure = giveMeAClosure();
console.log(myClosure());
console.log(myClosure());


console.log("using this keyword in outermost scope", this);
console.log("window objects keys: ", Object.keys(this));
// anonymous fucns don't have this value


let thisAnObj = {
    method: function() {
        console.log(this);
    },
    bar: "foo",
}

thisAnObj.method();

// num is passed to the func as value which is
// a copy of the og variable,
// obj is passed by reference, lives on heap
let aNum = 42;
let anObj = {name: "foo"}
console.log("aNum: ", aNum, "anObj: ", anObj)

function someFun(num, obj) {
    num = 21;
    obj.name = "bar";
}
someFun(aNum, anObj);
console.log("aNum: ", aNum, "anObj: ", anObj)


function bindThisMethod() {
    console.log(this);
}

let thisAnotherObj = {foo: "bar"};

const binded = bindThisMethod.bind(thisAnotherObj);
binded();


const human = {
    dna: "AACTG",
    name: "hooman",
    born: Date.now(),
    walk: () => {
        console.log("plug walk");
    },
}
human.walk();
console.log(human.born);

console.log("prototype of human obj: ", Object.getPrototypeOf(human));

class Human {
    constructor(name) {
        this.name = name;
        this.dna = "AACTG";
        this.gender = "";
    }

    get gndr() {
        console.log("hello world from the getter");
        return this.gender;
    }

    set gndr(val) {
        console.log("hello world from the setter");
        this.gender = val;
    }

    walk() {
        console.log("plug wolke");
    }

    static isHuman(human) {
        if (human.dna === "AACTG") {
            return true;
        }
    }
}
let myHuman = new Human("awooga");
myHuman.gndr = "male" // uses the setter
console.log("myhuman get gender: ", myHuman.gndr); // uses the getter
myHuman.walk();
console.log("human is human?: ", Human.isHuman(myHuman)); // static method usage


const arr = ["foo", "foo", "bar"];
const set = new Set(arr)
const map = new Map([
    ["foo", 1],
    ["bar", 2]
])

console.log("arr: ", arr);
console.log("set: ", set);
console.log("map: ", map);

// gets garbage collected
// const weakMap = new WeakMap([
//     ["foo", 1],
//     ["bar", 2]
// ])
// there is also a WeakSet


setTimeout(() => {
    console.log("after 3 secs");
}, 3000);
// console.log(greatSuccess); // is undefined yet


function isGreatSuccess() {
    return Math.random() < 0.5 ? true : false;
}

// promises are wrappers for values that aren't known yet
// but will resolve to a value in the future
const promise = new Promise(
    (resolve, reject) => {
        // async part
        if (isGreatSuccess()) {
            resolve("succeeded");
        } else {
            reject("faileded");
        }
    }
);

let result = promise
    .then(success => {
        console.log("promise then success executed");
        return "it's alive" + success;
    })

    .catch(err => {
        console.log("promise catch err executed");
        return "it's ded" + err;
    })
console.log("the promise itself: ", promise);

// async func will automatically return a promise
async function asyncFunWOER() {
    // await keyword stops execution to wait for the promise
    const result = await promise;
}
// in order to have error handling wrap the code in try catch
async function asyncFun() {
    try {
        const result = await promise;
        console.log("hello from asyncFun, result of promise: ", result);
    } catch (error) {

    }
}

asyncFun()