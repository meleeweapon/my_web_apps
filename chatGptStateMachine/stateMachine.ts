type State = "Initial" | "In Progress" | "Ended";

interface IState {
  state: State;
  execute: (context: Game) => void;
}

// class InitialState implements IState {
//   readonly state: State;
//   constructor() {
//     this.state = "Initial";
//   }
//   execute(currentState: State, context: StateMachine): void {
//     //
//   }
// }

const InProgressState: IState = {
  state: "In Progress",
  execute: (context: Game) => {
    console.log("hello from in progress state");
  },
};

const InitialState: IState = {
  state: "Initial",
  execute: (context: Game) => {
    console.log("hello from initial state");
    if (context.stateMachine.state === InitialState) {
      context.stateMachine.state = InProgressState;
    }
  },
};

class StateMachine {
  state: IState;
  context: Game;
  constructor(context: Game) {
    this.context = context;
    this.state = InitialState;
  }
  next(): void {
    this.state.execute(this.context);
  }
}

class Game {
  public color: string;
  public stateMachine: StateMachine;
  constructor() {
    this.color = "black";
    this.stateMachine = new StateMachine(this);
  }
  next(): void {
    this.stateMachine.next();
  }
}

const game = new Game();

document.querySelector("#next")?.addEventListener("click", () => {
  game.next();
});
