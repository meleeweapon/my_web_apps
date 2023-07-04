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
game.startGame();