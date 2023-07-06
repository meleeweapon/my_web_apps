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
    getPlayingState() {
        return this.playingState;
    }
    getScore() {
        return this.score;
    }
}
class View {
    questionText;
    choices;
    gameOver;
    score;
    constructor() {
        this.questionText = document.querySelector(".question-text");
        this.choices = [0, 1, 2, 3]
            .map((index) => "#choice-" + index.toString())
            .map((id) => document.querySelector(id));
        this.gameOver = document.querySelector(".game-over");
        this.score = document.querySelector(".score");
    }
    displayQuestionText(text) {
        this.questionText.textContent = text;
    }
    displayChoices(choiceArray) {
        this.choices.forEach((element, index) => {
            element.textContent = choiceArray[index];
        });
    }
    displayScore(score) {
        this.score.textContent = score.toString();
    }
    hideQuestionText() {
        this.questionText.setAttribute("hidden", "true");
    }
    hideChoices() {
        this.choices.forEach((c) => c.setAttribute("hidden", "true"));
    }
    hideQuestion() {
        this.hideQuestionText();
        this.hideChoices();
    }
    hideGameOver() {
        this.gameOver.setAttribute("hidden", "true");
    }
    exposeGameOver() {
        this.gameOver.removeAttribute("hidden");
    }
    gameOverScreen() {
        this.hideQuestion();
        this.exposeGameOver();
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
        this.renderScore();
    }
    renderQuestionText() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            console.log("no current question");
            return;
        }
        this.view.displayQuestionText(currentQuestion.questionText);
    }
    renderChoices() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            console.log("no current question");
            return;
        }
        this.view.displayChoices(currentQuestion.choices);
    }
    renderScore() {
        this.view.displayScore(this.game.getScore());
    }
    initializeEventListeners() {
        this.view.addEventListeners({ choices: this.choiceCallback }, this);
    }
    choiceCallback(event) {
        const target = event.target;
        const answer = target.textContent ?? "";
        this.game.submitAnswer(answer);
        this.game.advanceQuestion();
        if (this.game.getPlayingState() === "finished") {
            this.view.gameOverScreen();
        }
        this.renderAll();
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
async function getQuestions() {
    const response = await fetch('https://the-trivia-api.com/v2/questions');
    const questionsData = await response.json();
    const questions = questionsData.map((question) => {
        const randomIndex = Math.floor(Math.random() * question.incorrectAnswers.length);
        const choices = question.incorrectAnswers;
        choices.splice(randomIndex, 0, question.correctAnswer);
        return {
            questionText: question.question.text,
            choices: choices,
            playerAnswer: null,
            correctAnswer: question.correctAnswer,
        };
    });
    const game = new QuizGame(questions);
    const view = new View();
    const presenter = new Presenter(game, view);
}
getQuestions();
// const game = new QuizGame(questions);
// const view = new View();
// const presenter = new Presenter(game, view);
