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

class Choices {
  constructor(
    public a: string,
    public b: string,
    public c: string,
    public d: string
  ) {

  }
  isValidChoice(choice: string) {
    return choice in Object.values(this);
  }
}

class Question {
  public answer: string,
  constructor(
    public id: Id,
    public question: string,
    public choices: Choices,
    correctAnswer: string,
  ) {
    if (!choices.isValidChoice(correctAnswer)) {
      throw new Error("invalid answer");
    }
  }
}

class QuizRound {
  public choice: string | null;
  constructor(
    public question: Question,
  ) {
    this.choice = null;
  }

  makeChoice(string): void {
    this.choice = string;
  }
}