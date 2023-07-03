// model
const ID_LENGTH = 6;
class Id {
  value: string;
  constructor(value?: string) {
    if (value) {
      if (value.length !== ID_LENGTH) {
        throw new Error("ID length must be " + ID_LENGTH.toString());
      }
      this.value = value;
    } else {
      const randomValue = Math.random();
      this.value = randomValue.toString().split(".")[1].slice(0, ID_LENGTH);
    }
  }
}

type Choice = string;

class Choices {
  constructor(
    private readonly choices: Choice[],
  ) {

  }
  isValidChoice(choice: Choice) {
    return this.choices.includes(choice);
  }
  getAll(): string[] {
    return [...this.choices];
  }
}

class Answer {
  constructor(
    public questionId: Id,
    public choice: Choice,
  ) {
  }
}

class Player {
  public answers: Answer[];
  constructor(
    public name: string,
    answers: Answer[] = [],
  ) {
    this.answers = answers;
  }
}

class Question {
  public correctAnswer: string;
  constructor(
    public id: Id,
    public question: string,
    public choices: Choices,
    correctAnswer: string,
  ) {
    if (!choices.isValidChoice(correctAnswer)) {
      throw new Error("Invalid answer");
    }
    this.correctAnswer = correctAnswer;
  }
}

// class QuizRound {
//   constructor(
//     public question: Question,
//   ) {
//   }
// }

type Result = "correct" | "wrong" | "empty";

class AnswerResult {
  constructor(
    public answer: Answer,
    public result: Result,
  ) {
  }
}

class PlayerResult {
  constructor(
    public player: Player,
    public score: number,
    public answersResult: AnswerResult[],
  ) {
  }
}

class QuizGame {
  constructor(
    public players: Player[],
    public questions: Question[],
  ) {}
  public scores(): PlayerResult[] {
    const playerResults = this.players.map(player => {
      const answerResults = this.questions.map(question => {
        const answer = player.answers.find(a => a.questionId.value === question.id.value);
        const result: Result = answer
          ? question.correctAnswer.toLowerCase() === answer.choice.toLowerCase()
            ? "correct"
            : "wrong"
          : "empty";
        if (!answer) { throw new Error("answer was undefined"); }
        return new AnswerResult(answer, result);
      });
      const score = answerResults.filter(result => result.result === "correct").length;
      const playerResult = new PlayerResult(player, score, answerResults);
      return playerResult;
    });
    return playerResults;
  }
}

const player = new Player("awooga");