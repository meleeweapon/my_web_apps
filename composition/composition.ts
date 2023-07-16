const applyMixins = (derived: any, bases: any[]) => {
  bases.forEach((base) => {
    Object.getOwnPropertyNames(base.prototype).forEach((name) => {
      derived.prototype[name] = base.prototype[name];
    });
  });
};

class CanSayHi {
  name: string;
  sayHi(): string {
    return `Hello ${this.name}`;
  }
}

class HasSuperPower {
  heroName: string;
  useSuperPower(): string {
    return `${this.heroName} used: Fire.`;
  }
}

class SuperHero implements CanSayHi, HasSuperPower {
  heroName;
  constructor(public name) {
    this.heroName = `SUPER ${name}`;
  }
  sayHi: () => string;
  useSuperPower: () => string;
}

applyMixins(SuperHero, [CanSayHi, HasSuperPower]);

const joe = new SuperHero("Joe");
console.log(joe.sayHi());
console.log(joe.useSuperPower());
