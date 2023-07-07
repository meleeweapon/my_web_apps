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

type PlayingState = "waiting for questions" | "playing" | "finished";
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

  constructor() {
    this.questions = [];
    this.currentQuestion = null;
    this.score = 0;
    this.playingState = "waiting for questions";
  }

  public startGame(questions: Question[]): void {
    switch (this.playingState) {
      case "waiting for questions":
        if (!questions.length) { throw new Error("No questions were provided"); };
        this.questions = questions;
        this.currentQuestion = this.questions[0];
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

  public getPlayingState(): PlayingState {
    return this.playingState;
  }

  public getScore(): number {
    return this.score;
  }
}

function addClass(classToBeAdded: string, currentClass: string): string {
  const classes = currentClass.split(" ");
  if (classes.includes(classToBeAdded)) { return currentClass; }
  return `${currentClass} ${classToBeAdded}`;
}

function removeClass(classToBeRemoved: string, currentClass: string): string {
  const classes = currentClass.split(" ");
  if (!classes.includes(classToBeRemoved)) { return currentClass; }
  classes.splice(classes.indexOf(classToBeRemoved), 1);
  return classes.join(" ");
}

// view
interface eventListenerMap {
  choices?: Function,
  nextQuestion?: Function,
}

class View {
  private questionText: HTMLElement;
  private choices: HTMLElement[];
  private gameOver: HTMLElement;
  private score: HTMLElement;
  private nextQuestion: HTMLElement;

  constructor() {
    this.questionText = document.querySelector(".question-text") as HTMLElement;
    this.choices = [0, 1, 2, 3]
      .map((index) => "#choice-" + index.toString())
      .map((id) => document.querySelector(id) as HTMLElement);
    this.gameOver = document.querySelector(".game-over") as HTMLElement;
    this.score = document.querySelector(".score") as HTMLElement;
    this.nextQuestion = document.querySelector(".next-question-btn") as HTMLElement;
  }

  public displayQuestionText(text: string): void {
    this.questionText.textContent = text;
  }

  public displayChoices(choiceArray: string[]): void {
    this.choices.forEach((element, index) => {
      element.textContent = choiceArray[index];
    })
  }

  public displayScore(score: number): void {
    this.score.textContent = score.toString();
  }

  public hideQuestionText(): void {
    this.questionText.setAttribute("hidden", "true");
  }

  public hideChoices(): void {
    this.choices.forEach((c) => c.setAttribute("hidden", "true"));
  }

  public hideQuestion(): void {
    this.hideQuestionText();
    this.hideChoices();
  }

  public hideGameOver(): void {
    this.gameOver.setAttribute("hidden", "true");
  }

  public exposeGameOver(): void {
    this.gameOver.removeAttribute("hidden");
  }

  public exposeNextQuestion(): void {
    this.nextQuestion.setAttribute("class", addClass("visible", this.nextQuestion.className));
  }

  public hideNextQuestion(): void {
    this.nextQuestion.setAttribute("class", removeClass("visible", this.nextQuestion.className));
  }

  public gameOverScreen(): void {
    this.hideQuestion();
    this.exposeGameOver();
  }

  public highlightCorrectAnswer(elementIndex: number): void {
    const element = this.choices[elementIndex];
    element.setAttribute("class", addClass("correct-answer", element.className));
  }

  public dehighlightCorrectAnswer(): void {
    this.choices.forEach((choiceElement) => {
      choiceElement.setAttribute("class", removeClass("correct-answer", choiceElement.className));
    });
  }

  public highlightPlayerAnswerAsCorrect(elementIndex: number): void {
    const element = this.choices[elementIndex];
    element.setAttribute("class", addClass("correct-player-answer", element.className));
  }

  public highlightPlayerAnswerAsWrong(elementIndex: number): void {
    const element = this.choices[elementIndex];
    element.setAttribute("class", addClass("wrong-player-answer", element.className));
  }

  public dehighlightPlayerAnswer(): void {
    this.choices.forEach((choiceElement) => {
      choiceElement.setAttribute("class", removeClass("wrong-player-answer", choiceElement.className));
      choiceElement.setAttribute("class", removeClass("correct-player-answer", choiceElement.className));
    });
  }

  public addEventListeners(eventListeners: eventListenerMap, context: unknown): void {
    Object.entries(eventListeners).forEach((entry) => {
      const [elementName, callback] = entry;
      switch (elementName) {
        case "choices":
          this.choices.forEach((choiceElement) => {
            choiceElement.addEventListener("click", callback.bind(context));
          })
          break;

        case "nextQuestion":
          this.nextQuestion.addEventListener("click", callback.bind(context));
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

    this.initializeEventListeners();

    this.getQuestionsAndStartGame();
  }

  private renderAll(): void {
    this.renderQuestionText();
    this.renderChoices();
    this.renderScore();
    this.renderPlayerAnswerAndCorrectAnswer();
    this.renderNextQuestionBtn();
  }

  private renderNextQuestionBtn(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { return; }
    if (currentQuestion.playerAnswer === null) {
      this.view.hideNextQuestion();
      return;
    }
    this.view.exposeNextQuestion();
  }

  private renderQuestionText(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { 
      console.log("no current question");
      return;
    }
    this.view.displayQuestionText(currentQuestion.questionText);
  }

  private renderChoices(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { 
      console.log("no current question");
      return;
    }
    this.view.displayChoices(currentQuestion.choices);
  }

  private renderScore(): void {
    this.view.displayScore(this.game.getScore());
  }

  private renderPlayerAnswerAndCorrectAnswer(): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { return; }
    if (currentQuestion.playerAnswer === null) {
      this.view.dehighlightCorrectAnswer();
      this.view.dehighlightPlayerAnswer();
      return;
    }

    const playerAnwserIndex = this.getChoiceIndex(currentQuestion.playerAnswer);
    const correctAnwserIndex = this.getChoiceIndex(currentQuestion.correctAnswer);

    this.view.highlightCorrectAnswer(correctAnwserIndex);
    if (currentQuestion.correctAnswer === currentQuestion.playerAnswer) {
      this.view.highlightPlayerAnswerAsCorrect(playerAnwserIndex);
    } else {
      this.view.highlightPlayerAnswerAsWrong(playerAnwserIndex);
    }
  }

  private getChoiceIndex(choice: string): number {
    const choices = this.game.getCurrentQuestion()?.choices;
    const index = choices?.indexOf(choice);
    if (index === undefined) { throw new Error("Invalid choice"); }
    return index;
  }

  private initializeEventListeners(): void {
    this.view.addEventListeners({ 
      choices: this.choiceCallback,
      nextQuestion: this.nextQuestion,
    }, this);
  }

  private nextQuestion(): void {
    this.game.advanceQuestion();
    this.renderAll();
  }

  private choiceCallback(event: MouseEvent): void {
    const currentQuestion = this.game.getCurrentQuestion();
    if (!currentQuestion) { return; }
    if (currentQuestion.playerAnswer !== null) { return; }
    const target = event.target as HTMLElement;
    const answer = target.textContent ?? "";
    this.game.submitAnswer(answer);
    if (this.game.getPlayingState() === "finished") {
      this.view.gameOverScreen();
    }
    this.renderAll();
  }

  public async getQuestionsAndStartGame() {
    const response = await fetch('https://the-trivia-api.com/v2/questions');
    const questionsData = await response.json();
    const questions = questionsData.map((question): Question => {
      const randomIndex = Math.floor(Math.random() * question.incorrectAnswers.length);
      const choices = question.incorrectAnswers;
      choices.splice(randomIndex, 0, question.correctAnswer);
      return {
        questionText: question.question.text,
        choices: choices,
        playerAnswer: null,
        correctAnswer: question.correctAnswer,
      };
    })
    game.startGame(questions);
    this.renderAll();
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


const game = new QuizGame();
const view = new View();
const presenter = new Presenter(game, view);