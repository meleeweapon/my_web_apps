var Player = /** @class */ (function () {
    function Player(name) {
        this.name = name;
    }
    return Player;
}());
var commit_result = /** @class */ (function () {
    function commit_result(success, reason) {
        this.success = success;
        if (this.success) {
            this.reason = null;
            return;
        }
        this.reason = reason;
    }
    return commit_result;
}());
var Hangman_Game_Model = /** @class */ (function () {
    function Hangman_Game_Model(players, words, chances) {
        this.game_state = "playing";
        this.players = players;
        this.turn = this.players[0];
        this.words = words;
        this.set_random_secret_word();
        if (chances) {
            this.chances = chances;
        }
        else {
            this.chances = 10;
        }
        this.guess_board = Array(this.secret_word.length).fill(null);
    }
    Hangman_Game_Model.prototype.set_random_secret_word = function () {
        this.secret_word = this.random_word();
    };
    Hangman_Game_Model.prototype.random_word = function () {
        var index = Math.floor(Math.random() * this.words.length);
        return this.words[index];
    };
    Hangman_Game_Model.prototype.commit_letter = function (letter, index) {
        if (letter.length !== 1) {
            throw new Error("letter len was not 1");
        }
        // check if letter slot is not empty
        if (this.guess_board[index]) {
            return new commit_result(false, "full slot");
        }
        if (this.secret_word[index] !== letter) {
            return new commit_result(false, "wrong letter");
        }
        this.guess_board[index] = letter;
        return new commit_result(true);
    };
    return Hangman_Game_Model;
}());
var players = [new Player("booba"), new Player("awooga")];
var words = ["car", "tree", "chair"];
// const view = new View();
var game = new Hangman_Game_Model(players, words);
// const presenter = new Presenter(view, game);
