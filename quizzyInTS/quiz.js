"use strict";
// enum PlayingState {
//   "not started",
//   "playing",
//   "finished",
// }
class QuizGame {
    questions;
    currentQuestion;
    score;
    playingState;
    constructor(questions) {
        if (!questions.length) {
            throw new Error("no questions were provided");
        }
        this.questions = questions;
        this.currentQuestion = this.questions[0];
        this.score = 0;
        this.playingState = "not started";
    }
    setDefaultState() {
        this.currentQuestion = this.questions[0];
        this.score = 0;
        this.playingState = "not started";
    }
    startGame() {
        switch (this.playingState) {
            case "not started":
                this.playingState = "playing";
                break;
            default:
                break;
        }
    }
    endGame() {
        switch (this.playingState) {
            case "playing":
                this.playingState = "finished";
                break;
            default:
                break;
        }
    }
    nextQuestion() {
        if (!this.currentQuestion) {
            throw new Error("No more questions left");
        }
        const index = this.questions.indexOf(this.currentQuestion);
        return index + 1 >= this.questions.length ? null : this.questions[index + 1];
    }
    submitAnswer(answer) {
        if (!this.currentQuestion) {
            throw new Error("Can't submit null question");
        }
        if (!this.currentQuestion.choices.includes(answer)) {
            throw new Error("Invalid answer");
        }
        this.currentQuestion.playerAnswer = answer;
        if (this.currentQuestion.correctAnswer === this.currentQuestion.playerAnswer) {
            this.score += 1;
        }
    }
    advanceQuestion() {
        this.currentQuestion = this.nextQuestion();
        if (!this.currentQuestion) {
            this.endGame();
        }
    }
    getCurrentQuestion() {
        return this.currentQuestion;
    }
}
class View {
    questionText;
    choices;
    constructor() {
        this.questionText = document.querySelector(".question-text");
        this.choices = [0, 1, 2, 3]
            .map((index) => "#choice-" + index.toString())
            .map((id) => document.querySelector(id));
        this.mapOnView = {
            choices: this.choices,
        };
    }
    displayQuestionTest(text) {
        this.questionText.textContent = text;
    }
    displayChoices(choiceArray) {
        this.choices.forEach((element, index) => {
            element.textContent = choiceArray[index];
        });
    }
    addEventListeners(eventListeners, context) {
        Object.entries(eventListeners).forEach((entry) => {
            const [elementName, callback] = entry;
            switch (elementName) {
                case "choices":
                    this.choices.forEach((choiceElement) => {
                        choiceElement.addEventListener("click", callback.bind(context));
                    });
                    break;
                default:
                    throw new Error("invalid key");
                    break;
            }
        });
    }
}
class Presenter {
    game;
    view;
    constructor(game, view) {
        this.game = game;
        this.view = view;
        this.game.startGame();
        this.renderAll();
        this.initializeEventListeners();
    }
    renderAll() {
        this.renderQuestionText();
        this.renderChoices();
    }
    renderQuestionText() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            console.log("no current question");
            return;
        }
        this.view.displayQuestionTest(currentQuestion.questionText);
    }
    renderChoices() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            console.log("no current question");
            return;
        }
        this.view.displayChoices(currentQuestion.choices);
    }
    initializeEventListeners() {
        this.view.addEventListeners({ choices: this.choiceCallback }, this);
    }
    choiceCallback(event) {
        const answer = event.target.textContent;
        this.game.submitAnswer(answer);
    }
}
const questions = [
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
];
const game = new QuizGame(questions);
const view = new View();
const presenter = new Presenter(game, view);
