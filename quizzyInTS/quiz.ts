// model
interface Question {
  questionText: string,
  choices: string[],
  correctAnswer: string,
  playerAnswer: string | null,
}

type Result = "correct" | "wrong" | "empty";

interface QuestionResult {
  question: Question,
  result: Result,
}

type PlayingState = "not started" | "playing" | "finished";
// enum PlayingState {
//   "not started",
//   "playing",
//   "finished",
// }

class QuizGame {
  private questions: Question[];
  private currentQuestion: Question | null;
  private score: number;
  private playingState: PlayingState;

  constructor(questions: Question[]) {
    if (!questions.length) { throw new Error("no questions were provided"); }
    this.questions = questions;
    this.currentQuestion = this.questions[0];
    this.score = 0;
    this.playingState = "not started";
  }

  private setDefaultState(): void {
    this.currentQuestion = this.questions[0];
    this.score = 0;
    this.playingState = "not started";
  }

  public startGame(): void {
    switch (this.playingState) {
      case "not started":
        this.playingState = "playing";
        break;
      default:
        break;
    }
  }

  public endGame(): void {
    switch (this.playingState) {
      case "playing":
        this.playingState = "finished";
        break;
      default:
        break;
    }
  }

  private nextQuestion(): Question | null {
    if (!this.currentQuestion) { throw new Error("No more questions left"); }
    const index = this.questions.indexOf(this.currentQuestion);
    return index + 1 >= this.questions.length ? null : this.questions[index + 1];
  }

  public submitAnswer(answer: string): void {
    if (!this.currentQuestion) { throw new Error("Can't submit null question"); }
    if (!this.currentQuestion.choices.includes(answer)) { throw new Error("Invalid answer"); }
    this.currentQuestion.playerAnswer = answer;
    if (this.currentQuestion.correctAnswer === this.currentQuestion.playerAnswer) {
      this.score += 1;
    }
  }

  public advanceQuestion(): void {
    this.currentQuestion = this.nextQuestion();
    if (!this.currentQuestion) {
      this.endGame();
    }
  }

  public getCurrentQuestion(): Question | null {
    return this.currentQuestion;
  }
}

// view
interface eventListenerMap {
  choices?: Function,
}

class View {
  private questionText: HTMLElement;
  private choices: HTMLElement[];
  constructor() {
    this.questionText = document.querySelector(".question-text") as HTMLElement;
    this.choices = [0, 1, 2, 3]
      .map((index) => "#choice-" + index.toString())
      .map((id) => document.querySelector(id) as HTMLElement);
    this.mapOnView = {
      choices: this.choices,
    }
  }
  displayQuestionTest(text: string): void {
    this.questionText.textContent = text;
  }
  displayChoices(choiceArray: string[]): void {
    this.choices.forEach((element, index) => {
      element.textContent = choiceArray[index];
    })
  }
  addEventListeners(eventListeners: eventListenerMap, context: unknown): void {
    Object.entries(eventListeners).forEach((entry) => {
      const [elementName, callback] = entry;
      switch (elementName) {
        case "choices":
          this.choices.forEach((choiceElement) => {
            choiceElement.addEventListener("click", callback.bind(context));
          })
          break;
        default:
          throw new Error("invalid key");
          break;
      }
    })
  }
}

class Presenter {
  private game: QuizGame;
  private view: View;
  constructor(game: QuizGame, view: View) {
    this.game = game;
    this.view = view;

    this.game.startGame();
    this.renderAll();
    this.initializeEventListeners();
  }
  renderAll(): void {
    this.renderQuestionText();
    this.renderChoices();
  }
  renderQuestionText(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { 
      console.log("no current question");
      return;
    }
    this.view.displayQuestionTest(currentQuestion.questionText);
  }
  renderChoices(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { 
      console.log("no current question");
      return;
    }
    this.view.displayChoices(currentQuestion.choices);
  }
  initializeEventListeners(): void {
    this.view.addEventListeners({ choices: this.choiceCallback }, this);
  }
  choiceCallback(event): void {
    const answer = event.target.textContent;
    this.game.submitAnswer(answer);
  }
}

const questions: Question[] = [
  {
    questionText: "1 + 1 = ?",
    choices: ["5", "ten", "abraham lincoln", "2"],
    correctAnswer: "2",
    playerAnswer: null
  },
  {
    questionText: "you are ___",
    choices: ["beautiful", "ugly", "bad", "wrong"],
    correctAnswer: "beautiful",
    playerAnswer: null
  },
  {
    questionText: "not (true or false)",
    choices: ["true", "false"],
    correctAnswer: "false",
    playerAnswer: null
  },
]

const game = new QuizGame(questions);
const view = new View();
const presenter = new Presenter(game, view);