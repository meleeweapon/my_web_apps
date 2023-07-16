"use strict";
var _a;
// class InitialState implements IState {
//   readonly state: State;
//   constructor() {
//     this.state = "Initial";
//   }
//   execute(currentState: State, context: StateMachine): void {
//     //
//   }
// }
const InProgressState = {
    state: "In Progress",
    execute: (context) => {
        console.log("hello from in progress state");
    },
};
const InitialState = {
    state: "Initial",
    execute: (context) => {
        console.log("hello from initial state");
        if (context.stateMachine.state === InitialState) {
            context.stateMachine.state = InProgressState;
        }
    },
};
class StateMachine {
    constructor(context) {
        this.context = context;
        this.state = InitialState;
    }
    next() {
        this.state.execute(this.context);
    }
}
class Game {
    constructor() {
        this.color = "black";
        this.stateMachine = new StateMachine(this);
    }
    next() {
        this.stateMachine.next();
    }
}
const game = new Game();
(_a = document.querySelector("#next")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
    game.next();
});
