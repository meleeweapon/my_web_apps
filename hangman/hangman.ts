class Player {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class commit_result {
  success: boolean;
  reason: null | "full slot" | "wrong letter" | "game inactive";

  constructor(
    success: boolean, 
    reason?: null | "full slot" | "wrong letter" | "game inactive"
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
  }

  public set_random_secret_word(): void {
    this.secret_word = this.random_word();
  }

  public random_word(): string {
    const index = Math.floor(Math.random() * this.words.length);
    return this.words[index];
  }

  public commit_letter(letter: string, index: number): commit_result {
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
  }
}

const players = [new Player("booba"), new Player("awooga")];
const words = ["car", "tree", "chair"];

// const view = new View();
const game = new Hangman_Game_Model(players, words);
// const presenter = new Presenter(view, game);