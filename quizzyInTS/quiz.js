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
    constructor() {
        this.questions = [];
        this.currentQuestion = null;
        this.score = 0;
        this.playingState = "waiting for questions";
    }
    startGame(questions) {
        switch (this.playingState) {
            case "waiting for questions":
                if (!questions.length) {
                    throw new Error("No questions were provided");
                }
                ;
                this.questions = questions;
                this.currentQuestion = this.questions[0];
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
function addClass(classToBeAdded, currentClass) {
    const classes = currentClass.split(" ");
    if (classes.includes(classToBeAdded)) {
        return currentClass;
    }
    return `${currentClass} ${classToBeAdded}`;
}
function removeClass(classToBeRemoved, currentClass) {
    const classes = currentClass.split(" ");
    if (!classes.includes(classToBeRemoved)) {
        return currentClass;
    }
    classes.splice(classes.indexOf(classToBeRemoved), 1);
    return classes.join(" ");
}
class View {
    questionText;
    choices;
    gameOver;
    score;
    nextQuestion;
    constructor() {
        this.questionText = document.querySelector(".question-text");
        this.choices = [0, 1, 2, 3]
            .map((index) => "#choice-" + index.toString())
            .map((id) => document.querySelector(id));
        this.gameOver = document.querySelector(".game-over");
        this.score = document.querySelector(".score");
        this.nextQuestion = document.querySelector(".next-question-btn");
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
    exposeNextQuestion() {
        this.nextQuestion.setAttribute("class", addClass("visible", this.nextQuestion.className));
    }
    hideNextQuestion() {
        this.nextQuestion.setAttribute("class", removeClass("visible", this.nextQuestion.className));
    }
    gameOverScreen() {
        this.hideQuestion();
        this.exposeGameOver();
    }
    highlightCorrectAnswer(elementIndex) {
        const element = this.choices[elementIndex];
        element.setAttribute("class", addClass("correct-answer", element.className));
    }
    dehighlightCorrectAnswer() {
        this.choices.forEach((choiceElement) => {
            choiceElement.setAttribute("class", removeClass("correct-answer", choiceElement.className));
        });
    }
    highlightPlayerAnswerAsCorrect(elementIndex) {
        const element = this.choices[elementIndex];
        element.setAttribute("class", addClass("correct-player-answer", element.className));
    }
    highlightPlayerAnswerAsWrong(elementIndex) {
        const element = this.choices[elementIndex];
        element.setAttribute("class", addClass("wrong-player-answer", element.className));
    }
    dehighlightPlayerAnswer() {
        this.choices.forEach((choiceElement) => {
            choiceElement.setAttribute("class", removeClass("wrong-player-answer", choiceElement.className));
            choiceElement.setAttribute("class", removeClass("correct-player-answer", choiceElement.className));
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
                case "nextQuestion":
                    this.nextQuestion.addEventListener("click", callback.bind(context));
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
        this.initializeEventListeners();
        this.getQuestionsAndStartGame();
    }
    renderAll() {
        this.renderQuestionText();
        this.renderChoices();
        this.renderScore();
        this.renderPlayerAnswerAndCorrectAnswer();
        this.renderNextQuestionBtn();
    }
    renderNextQuestionBtn() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            return;
        }
        if (currentQuestion.playerAnswer === null) {
            this.view.hideNextQuestion();
            return;
        }
        this.view.exposeNextQuestion();
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
    renderPlayerAnswerAndCorrectAnswer() {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            return;
        }
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
        }
        else {
            this.view.highlightPlayerAnswerAsWrong(playerAnwserIndex);
        }
    }
    getChoiceIndex(choice) {
        const choices = this.game.getCurrentQuestion()?.choices;
        const index = choices?.indexOf(choice);
        if (index === undefined) {
            throw new Error("Invalid choice");
        }
        return index;
    }
    initializeEventListeners() {
        this.view.addEventListeners({
            choices: this.choiceCallback,
            nextQuestion: this.nextQuestion,
        }, this);
    }
    nextQuestion() {
        this.game.advanceQuestion();
        this.renderAll();
    }
    choiceCallback(event) {
        const currentQuestion = this.game.getCurrentQuestion();
        if (!currentQuestion) {
            return;
        }
        if (currentQuestion.playerAnswer !== null) {
            return;
        }
        const target = event.target;
        const answer = target.textContent ?? "";
        this.game.submitAnswer(answer);
        if (this.game.getPlayingState() === "finished") {
            this.view.gameOverScreen();
        }
        this.renderAll();
    }
    async getQuestionsAndStartGame() {
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
        game.startGame(questions);
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
const game = new QuizGame();
const view = new View();
const presenter = new Presenter(game, view);
