function is_alphabetical(str: string): boolean {
  if (!str) { return false; }
  for (let char_ind = 0; char_ind < str.length; char_ind += 1) {
    const code = str.charCodeAt(char_ind);
    if (!(code > 96 && code < 123) && !(code > 64 && code < 91)) { return false; }
  }
  return true;
}

class Player {
  public name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class commit_result {
  public success: boolean;
  public reason: null | "full slot" | "wrong letter" | "game inactive" | "tried_letter";

  constructor(
    success: boolean, 
    reason?: null | "full slot" | "wrong letter" | "game inactive" | "tried_letter"
  ) {
    this.success = success;
    if (this.success) {
      this.reason = null;
      return;
    }
    this.reason = reason;
  }
}

class Hangman_Game_Model {
  public game_state: "playing" | "over";
  public secret_word: string;
  public guess_board: string[];
  public players: Player[];
  public turn: Player;
  public words: string[];
  public chances: number;
  public tried_letters: string[];

  constructor(players: Player[], words: string[], chances?: number) {
    this.game_state = "playing";
    this.players = players;
    this.turn = this.players[0];
    this.words = words;
    this.secret_word = this.random_word();
    if (chances) {
      this.chances = chances;
    } else {
      this.chances = 10;
    }
    this.guess_board = Array(this.secret_word.length).fill(null);
    this.tried_letters = [];
  }

  public set_random_secret_word(): void {
    this.secret_word = this.random_word();
  }

  public random_word(): string {
    const index = Math.floor(Math.random() * this.words.length);
    return this.words[index];
  }

  public commit_letter(letter: string): commit_result {
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
      if (this.chances <= 0) {this.game_state = "over";}
      return new commit_result(false, "wrong letter");
    }

    const letter_indices = [];
    for (const letter_index in this.secret_word) {
      if (this.secret_word[letter_index] == letter) {
        letter_indices.push(letter_index);
      }
    }

    for (const index of letter_indices) {
      this.guess_board[index] = letter;
    }

    if (this.win_condition()) {
      this.game_state = "over";
    }
    this.turn = this.next_turn();
    return new commit_result(true);
  }

  public next_turn(): Player {
    if (this.turn === this.players[this.players.length - 1]) {
      return this.players[0];
    }
    const index = this.players.indexOf(this.turn);
    return this.players[index + 1];
  }

  public win_condition(): boolean {
    const current_letters = this.guess_board.join("");
    return current_letters === this.secret_word;
  }
}


class View {
  public guess_box = HTMLElement;
  public letter_boxes = Array<HTMLElement>;
  public input_field = HTMLElement;
  public chances = HTMLElement;
  public tried_letters = HTMLElement;

  constructor() {
    this.guess_box = document.querySelector(".guess-box");
    this.chances = document.querySelector(".chances");
    this.tried_letters = document.querySelector(".tried-letters");
    this.input_field = document.querySelector(".input-field");
    this.letter_boxes = [];
  }

  public render_chances(chances: number): void {
    this.chances.textContent = chances;
  }

  public render_tried_letters(letters: string[]): void {
    this.tried_letters.textContent = letters.join(" ");
  }

  public render_guess_box(letters: string[]): void {
    for (const letter_index in letters) {
      if (!letters[letter_index]) continue;
      // TODO: cache this in this class
      const letter = document.querySelector(`#letter-${letter_index}`);
      letter?.textContent = letters[letter_index];
    }
  }

  public init_word(letters: string[]): void {
    for (const letter_index in letters) {
      const letter_element = document.createElement("div");
      letter_element.id = `letter-${letter_index}`;
      letter_element.className = "letter";
      this.guess_box.appendChild(letter_element);
      this.letter_boxes.push(letter_element);
    }
  }

  // this feels wrong
  public element_handle(
    event_type: string,
    element: HTMLElement, 
    callback: Function,
    context,
    ...args
  ) {
    element.addEventListener(event_type, event => {
      callback.call(context, event, element, ...args);
    })
  }
}

class Presenter {
  public view: View;
  public game: Hangman_Game_Model;
  public input_field_last_value: string;

  constructor(view: View, game: Hangman_Game_Model) {
    this.view = view;
    this.game = game;

    this.view.init_word(this.game.guess_board);

    this.init_event_listeners();

    this.view.render_chances(this.game.chances);

    this.input_field_last_value = "";
  }

  public init_event_listeners() {
    this.view.element_handle(
      "input",
      this.view.input_field,
      this.input_field_callback,
      this,
    )
  }

  public input_field_callback(event, input_field_element) {
    if (this.game.game_state == "over") { return; }

    const input = event.data;
    if (input === null) {
      input_field_element.value = this.input_field_last_value;
      return;
    }

    if (!is_alphabetical(input)) {
      input_field_element.value = this.input_field_last_value;
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

    if (!result.success) {
      input_field_element.value = this.input_field_last_value;
    } else {
      input_field_element.value = sanitized_input.toUpperCase();
    }

    if (this.game.chances <= 0) {
      const won_element = document.createElement("div");
      won_element.textContent = "Lost";
      won_element.style.color = "#dd0000";
      won_element.style.textAlign = "center";
      won_element.style.fontSize = "64px";
      document.querySelector("body")?.appendChild(won_element);
    }
    if (this.game.win_condition()) {
      const won_element = document.createElement("div");
      won_element.textContent = "Won";
      won_element.style.color = "#00dd00";
      won_element.style.textAlign = "center";
      won_element.style.fontSize = "64px";
      document.querySelector("body")?.appendChild(won_element);
    }

    this.view.render_guess_box(
      this.game.guess_board
        .map(letter => {
          if (typeof letter === "string") {
            return letter.toUpperCase();
          } 
          return letter;
        })
    );
    this.view.render_chances(this.game.chances);
    const secret_word_array = Array.from(this.game.secret_word);
    const tried_letters = this.game.tried_letters.map(letter => letter.toUpperCase())
    this.view.render_tried_letters(tried_letters);
  }
}


const players = [new Player("booba"), new Player("awooga")];
const words = ["car", "tree", "chair"];

const view = new View();
const game = new Hangman_Game_Model(players, words);
const presenter = new Presenter(view, game);
