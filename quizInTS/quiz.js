"use strict";
// model
const idLength = 6;
class Id {
    value;
    constructor(value) {
        if (value) {
            if (value.length !== idLength) {
                throw new Error("id len was not 6");
            }
            this.value = value;
        }
        else {
            const randomValue = Math.random();
            this.value = randomValue.toString().split(".")[1].slice(0, idLength);
        }
    }
}
class Choices {
    a;
    b;
    c;
    d;
    constructor(a, b, c, d) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    isValidChoice(choice) {
        return choice in Object.values(this);
    }
}
class Question {
    id;
    question;
    choices;
    answer;
    constructor(id, question, choices, correctAnswer) {
        this.id = id;
        this.question = question;
        this.choices = choices;
        if (!choices.isValidChoice(correctAnswer)) {
            throw new Error("invalid answer");
        }
    }
}
class QuizRound {
    question;
    choice;
    constructor(question) {
        this.question = question;
        this.choice = null;
    }
    makeChoice(string) {
        this.choice = string;
    }
}
