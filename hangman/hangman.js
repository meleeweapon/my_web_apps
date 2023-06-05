"use strict";
function is_alphabetical(str) {
    if (!str) {
        return false;
    }
    for (let char_ind = 0; char_ind < str.length; char_ind += 1) {
        const code = str.charCodeAt(char_ind);
        if (!(code > 96 && code < 123) && !(code > 64 && code < 91)) {
            return false;
        }
    }
    return true;
}
class Player {
    constructor(name) {
        this.name = name;
    }
}
class commit_result {
    constructor(success, reason) {
        this.success = success;
        if (this.success) {
            this.reason = null;
            return;
        }
        this.reason = reason;
    }
}
class Hangman_Game_Model {
    constructor(players, words, chances) {
        this.game_state = "playing";
        this.players = players;
        this.turn = this.players[0];
        this.words = words;
        this.secret_word = this.random_word();
        if (chances) {
            this.chances = chances;
        }
        else {
            this.chances = 10;
        }
        this.guess_board = Array(this.secret_word.length).fill(null);
        this.tried_letters = [];
    }
    set_random_secret_word() {
        this.secret_word = this.random_word();
    }
    random_word() {
        const index = Math.floor(Math.random() * this.words.length);
        return this.words[index];
    }
    commit_letter(letter) {
        if (letter.length !== 1) {
            throw new Error("letter len was not 1");
        }
        if (this.game_state == "over") {
            return new commit_result(false, "game inactive");
        }
        if (this.tried_letters.includes(letter)) {
            return new commit_result(false, "tried_letter");
        }
        this.tried_letters.push(letter);
        if (!this.secret_word.includes(letter)) {
            this.turn = this.next_turn();
            this.chances -= 1;
            if (this.chances <= 0) {
                this.game_state = "over";
            }
            return new commit_result(false, "wrong letter");
        }
        const letter_indices = this.all_letter_indices(letter);
        // for (const letter_index in this.secret_word) {
        //   if (this.secret_word[letter_index] == letter) {
        //     letter_indices.push(letter_index);
        //   }
        // }
        for (const index of letter_indices) {
            this.guess_board[index] = letter;
        }
        if (this.win_condition()) {
            this.game_state = "over";
        }
        this.turn = this.next_turn();
        return new commit_result(true);
    }
    all_letter_indices(letter) {
        const letter_indices = [];
        for (const letter_index in this.secret_word) {
            if (this.secret_word[letter_index] == letter) {
                letter_indices.push(letter_index);
            }
        }
        return letter_indices;
    }
    next_turn() {
        if (this.turn === this.players[this.players.length - 1]) {
            return this.players[0];
        }
        const index = this.players.indexOf(this.turn);
        return this.players[index + 1];
    }
    win_condition() {
        const current_letters = this.guess_board.join("");
        return current_letters === this.secret_word;
    }
    random_letter() {
        const letter = this.secret_word[Math.floor(Math.random() * this.secret_word.length)];
        return letter;
    }
    reveal_random_letter() {
        const letter = this.random_letter();
        const letter_indices = this.all_letter_indices(letter);
        for (const index of letter_indices) {
            this.guess_board[index] = letter;
        }
        this.tried_letters.push(letter);
    }
    // is not precise
    reveal_ratio_of_letters(ratio) {
        if (!(ratio >= 0 && ratio <= 1)) {
            throw new Error("ratio is not between 0 and 1");
        }
        ;
        const min_reveals_amount = Math.floor(ratio * this.secret_word.length);
        for (let x = 0; x < min_reveals_amount; x += 1) {
            const current_revealed_ratio = Math.floor(this.guess_board.filter(letter => letter !== null).length // number of revealed letters
                / this.secret_word.length);
            if (current_revealed_ratio >= ratio) {
                break;
            }
            this.reveal_random_letter();
        }
    }
}
class View {
    constructor() {
        this.guess_box = HTMLElement;
        this.letter_boxes = (Array);
        this.input_field = HTMLElement;
        this.chances = HTMLElement;
        this.tried_letters = HTMLElement;
        this.guess_box = document.querySelector(".guess-box");
        this.chances = document.querySelector(".chances");
        this.tried_letters = document.querySelector(".tried-letters");
        this.input_field = document.querySelector(".input-field");
        this.letter_boxes = [];
    }
    render_chances(chances) {
        this.chances.textContent = chances;
    }
    render_tried_letters(letters) {
        this.tried_letters.textContent = letters.join(" ");
    }
    render_guess_box(letters) {
        for (const letter_index in letters) {
            if (!letters[letter_index])
                continue;
            // TODO: cache this in this class
            const letter = document.querySelector(`#letter-${letter_index}`);
            letter === null || letter === void 0 ? void 0 : letter.textContent = letters[letter_index];
        }
    }
    render_input_field(value) {
        this.input_field.value = value;
    }
    init_word(letters) {
        for (const letter_index in letters) {
            const letter_element = document.createElement("div");
            letter_element.id = `letter-${letter_index}`;
            letter_element.className = "letter";
            this.guess_box.appendChild(letter_element);
            this.letter_boxes.push(letter_element);
        }
    }
    // this feels wrong
    element_handle(event_type, element, callback, context, ...args) {
        element.addEventListener(event_type, event => {
            callback.call(context, event, element, ...args);
        });
    }
}
class Presenter {
    constructor(view, game) {
        this.view = view;
        this.game = game;
        this.view.init_word(this.game.guess_board);
        this.init_event_listeners();
        this.view.render_chances(this.game.chances);
        this.input_field_last_value = "";
        this.game.reveal_ratio_of_letters(0.25);
        this.render_everything();
    }
    init_event_listeners() {
        this.view.element_handle("input", this.view.input_field, this.input_field_callback, this);
    }
    input_field_callback(event, input_field_element) {
        var _a, _b;
        if (this.game.game_state == "over") {
            return;
        }
        const input = event.data;
        if (input === null) {
            // input_field_element.value = this.input_field_last_value;
            this.render_input_field_auto();
            return;
        }
        if (!is_alphabetical(input)) {
            // input_field_element.value = this.input_field_last_value;
            this.render_input_field_auto();
            return;
        }
        let sanitizing_input;
        if (input.length === 1) {
            sanitizing_input = input;
        }
        else if (input.length > 1) {
            sanitizing_input = input[input.length - 1];
        }
        const sanitized_input = sanitizing_input;
        this.input_field_last_value = sanitized_input;
        const result = this.game.commit_letter(sanitized_input);
        // if (!result.success) {
        //   this.render_input_field_auto()
        // } else {
        //   this.render_input_field_auto()
        // }
        if (this.game.chances <= 0) {
            const won_element = document.createElement("div");
            won_element.textContent = "Lost";
            won_element.style.color = "#dd0000";
            won_element.style.textAlign = "center";
            won_element.style.fontSize = "64px";
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.appendChild(won_element);
        }
        if (this.game.win_condition()) {
            const won_element = document.createElement("div");
            won_element.textContent = "Won";
            won_element.style.color = "#00dd00";
            won_element.style.textAlign = "center";
            won_element.style.fontSize = "64px";
            (_b = document.querySelector("body")) === null || _b === void 0 ? void 0 : _b.appendChild(won_element);
        }
        if (this.game.game_state === "over") {
            input_field_element.setAttribute("disabled", true);
        }
        this.render_everything();
    }
    render_guess_box_auto() {
        this.view.render_guess_box(this.game.guess_board
            .map(letter => {
            if (typeof letter === "string") {
                return letter.toUpperCase();
            }
            return letter;
        }));
    }
    render_tried_letters_auto() {
        const tried_letters = this.game.tried_letters.map(letter => letter.toUpperCase());
        this.view.render_tried_letters(tried_letters);
    }
    render_chances_auto() {
        this.view.render_chances(this.game.chances);
    }
    render_input_field_auto() {
        this.view.render_input_field(this.input_field_last_value.toUpperCase());
    }
    render_everything() {
        this.render_chances_auto();
        this.render_tried_letters_auto();
        this.render_guess_box_auto();
        this.render_input_field_auto();
    }
}
const players = [new Player("booba"), new Player("awooga")];
const words = ["car", "tree", "chair"];
const view = new View();
const game = new Hangman_Game_Model(players, words);
const presenter = new Presenter(view, game);
