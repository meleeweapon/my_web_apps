"use strict";
const applyMixins = (derived, bases) => {
    bases.forEach((base) => {
        Object.getOwnPropertyNames(base.prototype).forEach((name) => {
            derived.prototype[name] = base.prototype[name];
        });
    });
};
class CanSayHi {
    sayHi() {
        return `Hello ${this.name}`;
    }
}
class HasSuperPower {
    useSuperPower() {
        return `${this.heroName} used: Fire.`;
    }
}
class SuperHero {
    constructor(name) {
        this.name = name;
        this.heroName = `SUPER ${name}`;
    }
}
applyMixins(SuperHero, [CanSayHi, HasSuperPower]);
const joe = new SuperHero("Joe");
console.log(joe.sayHi());
console.log(joe.useSuperPower());
