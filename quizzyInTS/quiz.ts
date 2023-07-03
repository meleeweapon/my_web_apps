// model
const idLength = 6;
class Id {
  value: string;
  constructor(value?: string) {
    if (value) {
      if (value.length !== idLength) {
        throw new Error("id len was not 6");
      }
      this.value = value;
    } else {
      const randomValue = Math.random();
      this.value = randomValue.toString().split(".")[1].slice(0, idLength);
    }
  }
}

type Choice = string;

class Choices {
  constructor(
    private choices: Choice[],
  ) {

  }
  isValidChoice(choice: Choice) {
    return choice in this.choices;
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
    answers?: Answer[],
  ) {
    this.answers = !answers ? [] : answers;
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
      throw new Error("invalid answer");
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
    public answersCorrect: AnswerResult[],
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
      const score = 0;
      // const answersCorrect = player.answers
      //   .map(answer => {
      //     if (answer. in this.questions)
      //     const result = 
      //     new AnswerResult(answer, );
      //   })
      const answerResults = this.questions.map(question => {
        let result: Result;
        if (question.id.value in player.answers.map(a => a.questionId.value)) {
          const answer = player.answers.filter(a => a.questionId === question.id)[0];
          if (
            question.correctAnswer 
            === 
            answer.choice
          ) {
            result = "correct";
          } else {
            result = "wrong";
          }
        } else { result = "empty" }
        new AnswerResult(new Answer(answer), result);
      });
      const playerResult = new PlayerResult(player, score, answerResults);
      return playerResult;
    });
    return playerResults;
  }
}

const player = new Player("awooga");