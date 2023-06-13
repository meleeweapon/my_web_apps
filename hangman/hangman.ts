function is_alphabetical(str: string): boolean {
  if (!str) { return false; }
  for (let char_ind = 0; char_ind < str.length; char_ind += 1) {
    const code = str.charCodeAt(char_ind);
    if (!(code > 96 && code < 123) && !(code > 64 && code < 91)) { return false; }
  }
  return true;
}

function random_from(supports_index): any {
  const random_element = supports_index[Math.floor(Math.random() * supports_index.length)];
  return random_element;
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
  public game_state: "playing" | "paused" | "over";
  public secret_word: string;
  public guess_board: string[];
  public players: Player[];
  public turn: Player;
  public words: string[];
  public chances: number;
  public tried_letters: string[];
  public chance_ratio: number;
  public reveal_ratio: number;

  constructor(players: Player[], words: string[], chances?: number) {
    this.game_state = "paused";
    this.players = players;
    this.turn = this.players[0];
    this.words = words;
    this.secret_word = "";
    // this.chance_ratio = 1.50;
    this.chance_ratio = 0.75;
    this.reveal_ratio = 0.25;
    if (chances) {
      this.chances = chances;
    } else {
      // this.chances = 10;
      this.chances = 0;
    }
    this.guess_board = [];
    this.tried_letters = [];
  }

  public new_word(): void {
    this.secret_word = this.initialize_secret_word();
    this.chances = this.initialize_chances();
    this.guess_board = this.initialize_guess_board();
    this.tried_letters = this.initialize_tried_letters();
  }

  public initialize_guess_board(): string[] {
    return Array(this.secret_word.length).fill(null);
  }

  public initialize_tried_letters(): string[] {
    return [];
  }

  public initialize_chances(): number {
    return this.chance_amount_based_on_word_lenght(this.chance_ratio);
  }

  public initialize_secret_word(): string {
    return this.random_word();
  }

  public set_random_secret_word(): void {
    this.secret_word = this.random_word();
  }

  public chance_amount_based_on_word_lenght(ratio: number) {
    // const amount = Math.floor(this.secret_word.length * ratio);
    const amount = Math.floor(this.secret_word.length * 0.34) + 5;
    return amount;
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
      this.game_state = "paused";
    }
    this.turn = this.next_turn();
    return new commit_result(true);
  }

  public all_letter_indices(letter: string) {
    const letter_indices = [];
    for (const letter_index in this.secret_word) {
      if (this.secret_word[letter_index] == letter) {
        letter_indices.push(letter_index);
      }
    }
    return letter_indices;
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

  // public random_letter(): string {
  //   const letter = this.secret_word[Math.floor(Math.random() * this.secret_word.length)];
  //   return letter;
  // }

  public reveal_random_letter(): void {
    if (!this.guess_board.includes(null)) {
      throw new Error("no letters to reveal");
    }
    const letter = random_from(this.non_revealed_letters());

    this.commit_letter(letter);
  }

  public non_revealed_letters(): string[] {
    const letters = [];
    const revealed_letters = this.revealed_letters();
    for (const letter of this.secret_word) {
      if (!revealed_letters.includes(letter)) {
        letters.push(letter);
      }
    }
    return letters;
  }

  public revealed_letters(): string[] {
    return this.guess_board.filter(l => l !== null);
  }

  // is not precise
  public reveal_ratio_of_letters(ratio: number) {
    if (!(ratio >= 0 && ratio <= 1)) { throw new Error("ratio is not between 0 and 1")};

    const min_reveals_amount = Math.floor(ratio * this.secret_word.length);
    for (let x = 0; x < min_reveals_amount; x += 1) {
      const current_revealed_ratio = Math.floor(
        this.guess_board.filter(letter => letter !== null).length // number of revealed letters
        / this.secret_word.length
      );
      if (current_revealed_ratio >= ratio) { break; }
      this.reveal_random_letter();
      // this.commit_letter(this.random_letter())
    }
  }
}


class View {
  public guess_box: HTMLElement;
  public letter_boxes: Array<HTMLElement>;
  public input_field: HTMLElement;
  public chances: HTMLElement;
  public tried_letter_container: HTMLElement;
  public tried_letters: Array<HTMLElement>;
  public tip_button: HTMLElement;
  public tip_amount: HTMLElement;
  public game_over_text: HTMLElement;
  public next_word_button: HTMLElement;
  public retry_button: HTMLElement;
  public score: HTMLElement;

  constructor() {
    this.guess_box = document.querySelector(".guess-box");
    this.chances = document.querySelector(".chances");
    this.tried_letter_container = document.querySelector(".tried-letter-container");
    this.next_word_button = document.querySelector(".next-word-button");
    this.retry_button = document.querySelector(".retry-button");
    this.score = document.querySelector(".score");
    this.tried_letters = [
      "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",
      "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"
    ].map(letter => {
      const tried_letter = document.createElement("div");
      tried_letter.setAttribute("class", "tray-letter non-tried");
      tried_letter.setAttribute("id", letter);
      tried_letter.textContent = letter.toUpperCase();
      return tried_letter;
    })
    for (const tried_letter of this.tried_letters) {
      this.tried_letter_container.appendChild(tried_letter);
    }
    this.input_field = document.querySelector(".input-field");
    this.game_over_text = document.querySelector(".game-over-text")
    this.tip_button = document.querySelector(".tip-button");
    this.tip_amount = document.querySelector(".tip-amount");
    this.letter_boxes = [];
  }

  public render_chances(chances: number): void {
    this.chances.textContent = chances;
  }

  public reset_tried_letters(): void {
    for (const tried_letter of this.tried_letters) {
      tried_letter.setAttribute("class", "tray-letter non-tried");
    }
  }

  // TODO: if otherwise, set to non-tried
  public render_tried_letters(tried_letters: string[], confirmed_letters: string[]): void {
    // this.tried_letters.textContent = letters.join(" ");
    for (const letter of tried_letters) {
      const tried_letter_element = document.querySelector("#" + letter.toLocaleLowerCase());
      tried_letter_element?.setAttribute("class", "tray-letter tried");
    }
    for (const letter of confirmed_letters) {
      const tried_letter_element = document.querySelector("#" + letter.toLocaleLowerCase());
      tried_letter_element?.setAttribute("class", "tray-letter confirmed");
    }
  }

  public render_score(score: number): void {
    this.score.textContent = score.toString();
  }

  public focus_on_input_field(): void {
    this.input_field.focus();
  }

  public hide_game_over_text(): void {
    this.game_over_text.setAttribute("class", "game-over-text non-exposed")
  }

  public expose_game_over_text(): void {
    this.game_over_text.setAttribute("class", "game-over-text")
  }

  public hide_next_word_button(): void {
    this.next_word_button.setAttribute("class", "next-word-button non-available-button");
  }

  public expose_next_word_button(): void {
    this.next_word_button.setAttribute("class", "next-word-button");
  }

  public hide_retry_button(): void {
    this.retry_button.setAttribute("class", "retry-button non-available-button");
  }

  public expose_retry_button(): void {
    this.retry_button.setAttribute("class", "retry-button");
  }

  public disable_input_field(): void {
    this.input_field.setAttribute("disabled", true);
    this.input_field.setAttribute("class", "input-field disabled")
  }

  public enable_input_field(): void {
    // this.input_field.setAttribute("disabled", false);
    this.input_field.removeAttribute("disabled");
    this.input_field.setAttribute("class", "input-field")
  }

  public render_guess_box(letters: string[]): void {
    for (const letter_index in letters) {
      if (!letters[letter_index]) continue;
      // TODO: cache this in this class
      const letter = document.querySelector(`#letter-${letter_index}`);
      letter?.textContent = letters[letter_index];
    }
  }

  public render_win_condition(): void {
      // const won_element = document.createElement("div");
      // won_element.textContent = "Won";
      // won_element.style.color = "#00dd00";
      // won_element.style.textAlign = "center";
      // won_element.style.fontSize = "64px";
      // document.querySelector("body")?.appendChild(won_element);

      this.game_over_text.textContent = "Won";
      this.game_over_text.style.color = "#00dd00";
  }

  public render_lose_condition(): void {
      // const won_element = document.createElement("div");
      // won_element.textContent = "Lost";
      // won_element.style.color = "#dd0000";
      // won_element.style.textAlign = "center";
      // won_element.style.fontSize = "64px";
      // document.querySelector("body")?.appendChild(won_element);

      this.game_over_text.textContent = "Lost";
      this.game_over_text.style.color = "#dd0000";
  }

  public render_input_field(value: string): void {
    this.input_field.value = value;
  }

  public render_tip_amount(tip_amount: number): void {
    this.tip_amount.textContent = tip_amount;
  }

  public init_word(letters: string[]): void {
    while (this.guess_box.firstChild) {
      this.guess_box.removeChild(this.guess_box.firstChild);
    }
    this.letter_boxes = [];

    for (const letter_index in letters) {
      const letter_element = document.createElement("div");
      letter_element.setAttribute("id", `letter-${letter_index}`);
      letter_element.setAttribute("class", "letter");
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
  public tip_amount: number;
  public score: number;
  public score_multiplier: number;
  public max_tip: number;
  public tip_streak: number;
  public streak_for_tip: number;

  constructor(view: View, game: Hangman_Game_Model) {
    this.view = view;
    this.game = game;

    this.score_multiplier = 10;
    this.streak_for_tip = 3;
    this.max_tip = 1;

    this.score = 0;
    this.tip_amount = this.max_tip;
    this.tip_streak = 0;

    this.new_word_auto();
    this.init_event_listeners();
    this.render_everything();
  }

  public new_word_auto(): void {
    // if (this.game.game_state !== "paused") { return; }
    if (this.game.game_state === "playing") {
      return; 
    }

    if (this.tip_streak >= this.streak_for_tip) {
      this.increment_tip();
    }
    this.input_field_last_value = "";
    this.game.game_state = "playing";
    this.game.new_word();
    this.game.reveal_ratio_of_letters(this.game.reveal_ratio);
    this.view.hide_game_over_text();
    this.view.hide_next_word_button();
    this.view.reset_tried_letters();
    this.view.enable_input_field();
    this.view.init_word(this.game.guess_board);
    this.view.focus_on_input_field();
    this.render_everything();
  }

  public increment_tip(): void {
    if (this.tip_amount >= this.max_tip) {
      this.tip_amount = this.max_tip;
      return;
    }

    this.tip_amount += 1;
  }

  public init_event_listeners(): void {
    this.view.element_handle(
      "input",
      this.view.input_field,
      this.input_field_callback,
      this,
    )

    this.view.element_handle(
      "click",
      this.view.tip_button,
      this.tip_button_callback,
      this
    )

    for (const tray_letter_element of this.view.tried_letters) {
      this.view.element_handle(
        "click",
        tray_letter_element,
        this.tray_letter_callback,
        this
      )
    }

    this.view.element_handle(
      "click",
      this.view.next_word_button,
      this.next_word_callback,
      this
    )

    this.view.element_handle(
      "click",
      this.view.retry_button,
      this.retry_callback,
      this
    )
  }

  public next_word_callback(event, next_word_element: HTMLElement) {
    if (this.game.game_state !== "paused") { return; }
    this.new_word_auto();
  }

  public retry_callback(event, retry_element: HTMLElement) {
    if (this.game.game_state !== "over") { return; }
    this.view.hide_retry_button();
    this.score = 0;
    this.tip_streak = 0;
    this.tip_amount = this.max_tip;
    this.new_word_auto();
    this.game.game_state = "playing";
  }

  public input_field_callback(event, input_field_element: HTMLElement) {
    if (this.game.game_state == "over") { return; }

    const input = event.data;
    if (input === null) {
      this.render_input_field_auto();
      return;
    }

    if (!is_alphabetical(input)) {
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

    this.render_everything();
  }

  public tip_button_callback(event, tip_button_element: HTMLElement) {
    if (this.game.game_state !== "playing") {
      return;
    }

    if (this.tip_amount <= 0) {
      return;
    }
    if (this.game.non_revealed_letters().length <= 0) {
      return;
    }
    this.game.reveal_random_letter();
    this.tip_amount -= 1;
    this.tip_streak = 0;
    this.render_everything();
  }

  public tray_letter_callback(event, tray_letter_element: HTMLElement) {
    if (this.game.game_state !== "playing") { return; }
    const result = this.game.commit_letter(tray_letter_element.id);

    const sanitized_input = tray_letter_element.id;
    this.input_field_last_value = sanitized_input;

    this.render_everything();
  }

  public render_game_over_auto(): void {
    if (this.game.chances <= 0) {
      this.render_lose_condition_auto();
    }
    if (this.game.win_condition()) {
      this.score += this.game.secret_word.length * this.score_multiplier;
      if (this.tip_amount >= this.max_tip) {
        this.tip_streak = 0;
      } else {
        this.tip_streak += 1;
      }
      this.render_win_condition_auto();
    }
    if (this.game.game_state !== "playing") {
      this.view.disable_input_field();
      this.view.expose_game_over_text();
    }
  }

  public render_lose_condition_auto(): void {
      this.view.render_lose_condition();
      this.view.expose_retry_button();
      this.render_guess_box_reveal_secret_word();
  }

  public render_win_condition_auto(): void {
    this.view.render_win_condition();
    this.view.expose_next_word_button();
  }

  public render_guess_box_reveal_secret_word(): void {
    this.view.render_guess_box(
      Array.from(this.game.secret_word)
        .map(letter => {
          if (typeof letter === "string") {
            return letter.toUpperCase();
          } 
          return letter;
        })
    );
  }

  public render_guess_box_auto(): void {
    this.view.render_guess_box(
      this.game.guess_board
        .map(letter => {
          if (typeof letter === "string") {
            return letter.toUpperCase();
          } 
          return letter;
        })
    );
  }

  public render_tried_letters_auto(): void {
    // const tried_letters = this.game.tried_letters.map(letter => letter.toUpperCase())
    const tried_letters = this.game.tried_letters;
    const confirmed_letters = this.game.guess_board.filter(l => l !== null)
    this.view.render_tried_letters(tried_letters, confirmed_letters);
  }

  public render_chances_auto(): void {
    this.view.render_chances(this.game.chances);
  }

  public render_input_field_auto(): void {
    this.view.render_input_field(this.input_field_last_value.toUpperCase());
  }

  public render_tip_amount_auto(): void {
    this.view.render_tip_amount(this.tip_amount);
  }

  public render_score_auto(): void {
    this.view.render_score(this.score);
  }

  public render_everything(): void {
    this.render_chances_auto();
    this.render_tried_letters_auto();
    this.render_guess_box_auto();
    this.render_input_field_auto();
    this.render_tip_amount_auto();
    this.render_game_over_auto();
    this.render_score_auto();
  }
}

const players = [new Player("booba"), new Player("awooga")];
const words = ["the", "and", "you", "have", "that", "for", "with", "this", "that", "not", "but", "they", "say", "what", "his", "from", "get", "she", "can", "know", "your", "all", "who", "about", "their", "will", "would", "make", "just", "think", "time", "there", "see", "her", "out", "one", "come", "people", "take", "year", "him", "them", "some", "want", "how", "when", "which", "now", "like", "other", "could", "our", "into", "here", "then", "than", "look", "way", "more", "these", "thing", "well", "because", "also", "two", "use", "tell", "good", "first", "man", "day", "find", "give", "more", "new", "one", "any", "those", "very", "her", "need", "back", "there", "should", "even", "only", "many", "really", "work", "life", "why", "right", "down", "try", "let", "something", "too", "call", "woman", "may", "still", "through", "mean", "after", "never", "world", "feel", "yeah", "great", "last", "child", "over", "ask", "when", "school", "state", "much", "talk", "out", "keep", "leave", "put", "like", "help", "big", "where", "same", "all", "own", "while", "start", "three", "high", "every", "another", "become", "most", "between", "happen", "family", "over", "president", "old", "yes", "house", "show", "again", "student", "seem", "might", "part", "hear", "its", "place", "problem", "where", "believe", "country", "always", "week", "point", "hand", "off", "play", "turn", "few", "group", "such", "against", "run", "guy", "about", "case", "question", "work", "night", "live", "game", "number", "write", "bring", "without", "money", "lot", "most", "book", "system", "government", "next", "city", "company", "story", "today", "job", "move", "must", "bad", "friend", "during", "begin", "love", "each", "hold", "different", "american", "little", "before", "ever", "word", "fact", "right", "read", "anything", "nothing", "sure", "small", "month", "program", "maybe", "right", "under", "business", "home", "kind", "stop", "pay", "study", "since", "issue", "name", "idea", "room", "percent", "far", "away", "law", "actually", "large", "though", "provide", "lose", "power", "kid", "war", "understand", "head", "mother", "real", "best", "team", "eye", "long", "long", "side", "water", "young", "wait", "okay", "both", "yet", "after", "meet", "service", "area", "important", "person", "hey", "thank", "much", "someone", "end", "change", "however", "only", "around", "hour", "everything", "national", "four", "line", "girl", "around", "watch", "until", "father", "sit", "create", "information", "car", "learn", "least", "already", "kill", "minute", "party", "include", "stand", "together", "back", "follow", "health", "remember", "often", "reason", "speak", "ago", "set", "black", "member", "community", "once", "social", "news", "allow", "win", "body", "lead", "continue", "whether", "enough", "spend", "level", "able", "political", "almost", "boy", "university", "before", "stay", "add", "later", "change", "five", "probably", "center", "among", "face", "public", "die", "food", "else", "history", "buy", "result", "morning", "off", "parent", "office", "course", "send", "research", "walk", "door", "white", "several", "court", "home", "grow", "better", "open", "moment", "including", "consider", "both", "such", "little", "within", "second", "late", "street", "free", "better", "everyone", "policy", "table", "sorry", "care", "low", "human", "please", "hope", "process", "teacher", "data", "offer", "death", "whole", "experience", "plan", "easy", "education", "build", "expect", "fall", "himself", "age", "hard", "sense", "across", "show", "early", "college", "music", "appear", "mind", "class", "police", "use", "effect", "season", "tax", "heart", "son", "art", "possible", "serve", "break", "although", "end", "market", "even", "air", "force", "require", "foot", "listen", "agree", "according", "anyone", "baby", "wrong", "love", "cut", "decide", "republican", "full", "behind", "pass", "interest", "sometimes", "security", "eat", "report", "control", "rate", "local", "suggest", "report", "nation", "sell", "action", "support", "wife", "decision", "receive", "value", "base", "pick", "phone", "thanks", "event", "drive", "strong", "reach", "remain", "explain", "site", "hit", "pull", "church", "model", "perhaps", "relationship", "six", "fine", "movie", "field", "raise", "less", "player", "couple", "million", "themselves", "record", "especially", "difference", "light", "development", "federal", "former", "role", "pretty", "myself", "view", "price", "effort", "nice", "quite", "along", "voice", "finally", "department", "either", "toward", "leader", "because", "photo", "wear", "space", "project", "return", "position", "special", "million", "film", "need", "major", "type", "town", "article", "road", "form", "chance", "drug", "economic", "situation", "choose", "practice", "cause", "happy", "science", "join", "teach", "early", "develop", "share", "yourself", "carry", "clear", "brother", "matter", "dead", "image", "star", "cost", "simply", "post", "society", "picture", "piece", "paper", "energy", "personal", "building", "military", "open", "doctor", "activity", "exactly", "american", "media", "miss", "evidence", "product", "realize", "save", "arm", "technology", "catch", "comment", "look", "term", "color", "cover", "describe", "guess", "choice", "source", "mom", "soon", "director", "international", "rule", "campaign", "ground", "election", "face", "check", "page", "fight", "itself", "test", "patient", "produce", "certain", "whatever", "half", "video", "support", "throw", "third", "care", "rest", "recent", "available", "step", "ready", "opportunity", "official", "oil", "call", "organization", "character", "single", "current", "likely", "county", "future", "dad", "whose", "less", "shoot", "industry", "second", "list", "general", "stuff", "figure", "attention", "forget", "risk", "focus", "short", "fire", "dog", "red", "hair", "point", "condition", "wall", "daughter", "before", "deal", "author", "truth", "upon", "husband", "period", "series", "order", "officer", "close", "land", "note", "computer", "thought", "economy", "goal", "bank", "behavior", "sound", "deal", "certainly", "nearly", "increase", "act", "north", "well", "blood", "culture", "medical", "everybody", "top", "difficult", "close", "language", "window", "response", "population", "lie", "tree", "park", "worker", "draw", "plan", "drop", "push", "earth", "cause", "per", "private", "tonight", "race", "than", "letter", "other", "gun", "simple", "course", "wonder", "involve", "hell", "poor", "each", "answer", "nature", "administration", "common", "hard", "message", "song", "enjoy", "similar", "congress", "attack", "past", "hot", "seek", "amount", "analysis", "store", "defense", "bill", "like", "cell", "away", "performance", "hospital", "bed", "board", "protect", "century", "summer", "material", "individual", "recently", "example", "represent", "fill", "state", "place", "animal", "fail", "factor", "natural", "sir", "agency", "usually", "significant", "help", "ability", "mile", "statement", "entire", "democrat", "floor", "serious", "career", "dollar", "vote", "sex", "compare", "south", "forward", "subject", "financial", "identify", "beautiful", "decade", "bit", "reduce", "sister", "quality", "quickly", "act", "press", "worry", "accept", "enter", "mention", "sound", "thus", "plant", "movement", "scene", "section", "treatment", "wish", "benefit", "interesting", "west", "candidate", "approach", "determine", "resource", "claim", "answer", "prove", "sort", "enough", "size", "somebody", "knowledge", "rather", "hang", "sport", "loss", "argue", "left", "note", "meeting", "skill", "card", "feeling", "despite", "degree", "crime", "that", "sign", "occur", "imagine", "vote", "near", "king", "box", "present", "figure", "seven", "foreign", "laugh", "disease", "lady", "beyond", "discuss", "finish", "design", "concern", "ball", "east", "recognize", "apply", "prepare", "network", "huge", "success", "district", "cup", "name", "physical", "growth", "rise", "standard", "force", "sign", "fan", "theory", "staff", "hurt", "legal", "september", "set", "outside", "strategy", "clearly", "property", "lay", "final", "authority", "perfect", "method", "region", "since", "impact", "indicate", "safe", "committee", "supposed", "dream", "training", "shit", "central", "option", "eight", "particularly", "completely", "opinion", "main", "ten", "interview", "exist", "remove", "dark", "play", "union", "professor", "pressure", "purpose", "stage", "blue", "herself", "sun", "pain", "artist", "employee", "avoid", "account", "release", "fund", "environment", "treat", "specific", "version", "shot", "hate", "reality", "visit", "club", "justice", "river", "brain", "memory", "rock", "talk", "camera", "global", "various", "arrive", "notice", "bit", "detail", "challenge", "argument", "lot", "nobody", "weapon", "best", "station", "island", "absolutely", "instead", "discussion", "instead", "affect", "design", "little", "anyway", "respond", "control", "trouble", "conversation", "manage", "close", "date", "public", "army", "top", "post", "charge", "seat", "assume", "writer", "perform", "credit", "green", "marriage", "operation", "indeed", "sleep", "necessary", "reveal", "agent", "access", "bar", "debate", "leg", "contain", "beat", "cool", "democratic", "cold", "glass", "improve", "adult", "trade", "religious", "head", "review", "kind", "address", "association", "measure", "stock", "gas", "deep", "lawyer", "production", "relate", "middle", "management", "original", "victim", "cancer", "speech", "particular", "trial", "none", "item", "weight", "tomorrow", "step", "positive", "form", "citizen", "study", "trip", "establish", "executive", "politics", "stick", "customer", "manager", "rather", "publish", "popular", "sing", "ahead", "conference", "total", "discover", "fast", "base", "direction", "sunday", "maintain", "past", "majority", "peace", "dinner", "partner", "user", "above", "fly", "bag", "therefore", "rich", "individual", "tough", "owner", "shall", "inside", "voter", "tool", "june", "far", "may", "mountain", "range", "coach", "fear", "friday", "attorney", "unless", "nor", "expert", "structure", "budget", "insurance", "text", "freedom", "crazy", "reader", "style", "through", "march", "machine", "november", "generation", "income", "born", "admit", "hello", "onto", "sea", "okay", "mouth", "throughout", "own", "test", "web", "shake", "threat", "solution", "shut", "down", "travel", "scientist", "hide", "obviously", "refer", "alone", "drink", "investigation", "senator", "unit", "photograph", "july", "television", "key", "sexual", "radio", "prevent", "once", "modern", "senate", "violence", "touch", "feature", "audience", "evening", "whom", "front", "hall", "task", "score", "skin", "suffer", "wide", "spring", "experience", "civil", "safety", "weekend", "while", "worth", "title", "heat", "normal", "hope", "yard", "finger", "tend", "mission", "eventually", "participant", "hotel", "judge", "pattern", "break", "institution", "faith", "professional", "reflect", "folk", "surface", "fall", "client", "edge", "traditional", "council", "device", "firm", "environmental", "responsibility", "chair", "internet", "october", "funny", "immediately", "investment", "ship", "effective", "previous", "content", "consumer", "element", "nuclear", "spirit", "directly", "afraid", "define", "handle", "track", "run", "wind", "lack", "cost", "announce", "journal", "heavy", "ice", "collection", "feed", "soldier", "just", "governor", "fish", "shoulder", "cultural", "successful", "fair", "trust", "suddenly", "future", "interested", "deliver", "saturday", "editor", "fresh", "anybody", "destroy", "claim", "critical", "agreement", "powerful", "researcher", "concept", "willing", "band", "marry", "promise", "easily", "restaurant", "league", "senior", "capital", "anymore", "april", "potential", "etc", "quick", "magazine", "status", "attend", "replace", "due", "hill", "kitchen", "achieve", "screen", "generally", "mistake", "along", "strike", "battle", "spot", "basic", "very", "corner", "target", "driver", "beginning", "religion", "crisis", "count", "museum", "engage", "communication", "murder", "blow", "object", "express", "huh", "encourage", "matter", "blog", "smile", "return", "belief", "block", "debt", "fire", "labor", "understanding", "neighborhood", "contract", "middle", "species", "additional", "sample", "involved", "inside", "mostly", "path", "concerned", "apple", "conduct", "god", "wonderful", "library", "prison", "hole", "attempt", "complete", "code", "sales", "gift", "refuse", "increase", "garden", "introduce", "roll", "christian", "definitely", "like", "lake", "turn", "sure", "earn", "plane", "vehicle", "examine", "application", "thousand", "coffee", "gain", "result", "file", "billion", "reform", "ignore", "welcome", "gold", "jump", "planet", "location", "bird", "amazing", "principle", "promote", "search", "nine", "alive", "possibility", "sky", "otherwise", "remind", "healthy", "fit", "horse", "advantage", "commercial", "steal", "basis", "context", "highly", "christmas", "strength", "move", "monday", "mean", "alone", "beach", "survey", "writing", "master", "cry", "scale", "resident", "football", "sweet", "failure", "reporter", "commit", "fight", "one", "associate", "vision", "function", "truly", "sick", "average", "human", "stupid", "will", "chinese", "connection", "camp", "stone", "hundred", "key", "truck", "afternoon", "responsible", "secretary", "apparently", "smart", "southern", "totally", "western", "collect", "conflict", "burn", "learning", "wake", "contribute", "ride", "british", "following", "order", "share", "newspaper", "foundation", "variety", "perspective", "document", "presence", "stare", "lesson", "limit", "appreciate", "complete", "observe", "currently", "hundred", "fun", "crowd", "attack", "apartment", "survive", "guest", "soul", "protection", "intelligence", "yesterday", "somewhere", "border", "reading", "terms", "leadership", "present", "chief", "attitude", "start", "deny", "website", "seriously", "actual", "recall", "fix", "negative", "connect", "distance", "regular", "climate", "relation", "flight", "dangerous", "boat", "aspect", "grab", "until", "favorite", "like", "january", "independent", "volume", "lots", "front", "online", "theater", "speed", "aware", "identity", "demand", "extra", "charge", "guard", "demonstrate", "fully", "tuesday", "facility", "farm", "mind", "fun", "thousand", "august", "hire", "light", "link", "shoe", "institute", "below", "living", "european", "quarter", "basically", "forest", "multiple", "poll", "wild", "measure", "twice", "cross", "background", "settle", "winter", "focus", "presidential", "operate", "fuck", "view", "daily", "shop", "above", "division", "slowly", "advice", "reaction", "injury", "ticket", "grade", "wow", "birth", "painting", "outcome", "enemy", "damage", "being", "storm", "shape", "bowl", "commission", "captain", "ear", "troop", "female", "wood", "warm", "clean", "lead", "minister", "neighbor", "tiny", "mental", "software", "glad", "finding", "lord", "drive", "temperature", "quiet", "spread", "bright", "cut", "influence", "kick", "annual", "procedure", "respect", "wave", "tradition", "threaten", "primary", "strange", "actor", "blame", "active", "cat", "depend", "bus", "clothes", "affair", "contact", "category", "topic", "victory", "direct", "towards", "map", "egg", "ensure", "general", "expression", "past", "session", "competition", "possibly", "technique", "mine", "average", "intend", "impossible", "moral", "academic", "wine", "approach", "somehow", "gather", "scientific", "african", "cook", "participate", "gay", "appropriate", "youth", "dress", "straight", "weather", "recommend", "medicine", "novel", "obvious", "thursday", "exchange", "explore", "extend", "bay", "invite", "tie", "belong", "obtain", "broad", "conclusion", "progress", "surprise", "assessment", "smile", "feature", "cash", "defend", "pound", "correct", "married", "pair", "slightly", "loan", "village", "half", "suit", "demand", "historical", "meaning", "attempt", "supply", "lift", "ourselves", "honey", "bone", "consequence", "unique", "next", "regulation", "award", "bottom", "excuse", "familiar", "classroom", "search", "reference", "emerge", "long", "lunch", "judge", "desire", "instruction", "emergency", "thinking", "tour", "french", "combine", "moon", "sad", "address", "december", "anywhere", "chicken", "fuel", "train", "abuse", "construction", "wednesday", "link", "deserve", "famous", "intervention", "grand", "visit", "confirm", "lucky", "insist", "coast", "proud", "cover", "fourth", "cop", "angry", "native", "supreme", "baseball", "but", "email", "accident", "front", "duty", "growing", "struggle", "revenue", "expand", "chief", "launch", "trend", "ring", "repeat", "breath", "inch", "neck", "core", "terrible", "billion", "relatively", "complex", "press", "miss", "slow", "soft", "generate", "extremely", "last", "drink", "forever", "corporate", "deep", "prefer", "except", "cheap", "literature", "direct", "mayor", "male", "importance", "record", "danger", "emotional", "knee", "ass", "capture", "traffic", "fucking", "outside", "now", "train", "plate", "equipment", "select", "file", "studio", "expensive", "secret", "engine", "adopt", "luck", "via", "panel", "hero", "circle", "critic", "solve", "busy", "episode", "back", "check", "requirement", "politician", "rain", "colleague", "disappear", "beer", "predict", "exercise", "tired", "democracy", "ultimately", "setting", "honor", "works", "unfortunately", "theme", "issue", "male", "clean", "united", "pool", "educational", "empty", "comfortable", "investigate", "useful", "pocket", "digital", "plenty", "entirely", "fear", "afford", "sugar", "teaching", "conservative", "chairman", "error", "bridge", "tall", "specifically", "flower", "though", "universe", "live", "acknowledge", "limit", "coverage", "crew", "locate", "balance", "equal", "lip", "lean", "zone", "wedding", "copy", "score", "joke", "used", "clear", "bear", "meal", "review", "minority", "sight", "sleep", "russian", "dress", "release", "soviet", "profit", "challenge", "careful", "gender", "tape", "ocean", "unidentified", "host", "grant", "circumstance", "late", "boss", "declare", "domestic", "tea", "organize", "english", "neither", "either", "official", "surround", "manner", "surprised", "percentage", "massive", "cloud", "winner", "honest", "standard", "propose", "rely", "plus", "sentence", "request", "appearance", "regarding", "excellent", "criminal", "salt", "beauty", "bottle", "component", "under", "fee", "jewish", "yours", "dry", "dance", "shirt", "tip", "plastic", "indian", "mark", "tooth", "meat", "stress", "illegal", "significantly", "february", "constitution", "definition", "uncle", "metal", "album", "self", "suppose", "investor", "fruit", "holy", "desk", "eastern", "valley", "largely", "abortion", "chapter", "commitment", "celebrate", "arrest", "dance", "prime", "urban", "internal", "bother", "proposal", "shift", "capacity", "guilty", "warn", "influence", "weak", "except", "catholic", "nose", "variable", "convention", "jury", "root", "incident", "climb", "hearing", "everywhere", "payment", "bear", "conclude", "scream", "surgery", "shadow", "witness", "increasingly", "chest", "amendment", "paint", "secret", "complain", "extent", "pleasure", "nod", "holiday", "super", "talent", "necessarily", "liberal", "expectation", "ride", "accuse", "knock", "previously", "wing", "corporation", "sector", "fat", "experiment", "match", "thin", "farmer", "rare", "english", "confidence", "bunch", "bet", "cite", "northern", "speaker", "breast", "contribution", "leaf", "creative", "interaction", "hat", "doubt", "promise", "pursue", "overall", "nurse", "question", "gene", "package", "weird", "difficulty", "hardly", "daddy", "estimate", "list", "era", "comment", "aid", "invest", "personally", "notion", "explanation", "airport", "chain", "expose", "lock", "convince", "channel", "carefully", "tear", "estate", "initial", "offer", "purchase", "guide", "forth", "his", "bond", "birthday", "travel", "pray", "improvement", "ancient", "ought", "escape", "trail", "brown", "fashion", "length", "sheet", "funding", "meanwhile", "fault", "barely", "eliminate", "motion", "essential", "apart", "combination", "limited", "description", "mix", "snow", "implement", "pretty", "proper", "part", "marketing", "approve", "other", "bomb", "slip", "regional", "lack", "muscle", "contact", "rise", "likely", "creation", "typically", "spending", "instrument", "mass", "far", "thick", "kiss", "increased", "inspire", "separate", "noise", "yellow", "aim", "cycle", "signal", "app", "golden", "reject", "inform", "perception", "visitor", "cast", "contrast", "judgment", "mean", "rest", "representative", "pass", "regime", "merely", "producer", "whoa", "route", "lie", "typical", "analyst", "account", "elect", "smell", "female", "living", "disability", "comparison", "hand", "rating", "campus", "assess", "solid", "branch", "mad", "somewhat", "gentleman", "opposition", "fast", "suspect", "land", "hit", "aside", "athlete", "opening", "prayer", "frequently", "employ", "basketball", "existing", "revolution", "click", "emotion", "fuck", "platform", "behind", "frame", "appeal", "quote", "potential", "struggle", "brand", "enable", "legislation", "addition", "lab", "oppose", "row", "immigration", "asset", "observation", "online", "taste", "decline", "attract", "for", "household", "separate", "breathe", "existence", "mirror", "pilot", "stand", "relief", "milk", "warning", "heaven", "flow", "literally", "quit", "calorie", "seed", "vast", "bike", "german", "employer", "drag", "technical", "disaster", "display", "sale", "bathroom", "succeed", "consistent", "agenda", "enforcement", "diet", "mark", "silence", "journalist", "bible", "queen", "divide", "expense", "cream", "exposure", "priority", "soil", "angel", "journey", "trust", "relevant", "tank", "cheese", "schedule", "bedroom", "tone", "selection", "date", "perfectly", "wheel", "gap", "veteran", "below", "disagree", "characteristic", "protein", "resolution", "whole", "regard", "fewer", "engineer", "walk", "dish", "waste", "print", "depression", "dude", "fat", "present", "upper", "wrap", "ceo", "visual", "initiative", "rush", "gate", "slow", "whenever", "entry", "japanese", "gray", "assistance", "height", "compete", "rule", "due", "essentially", "benefit", "phase", "conservative", "recover", "criticism", "faculty", "achievement", "alcohol", "therapy", "offense", "touch", "killer", "personality", "landscape", "deeply", "reasonable", "soon", "suck", "transition", "fairly", "column", "wash", "button", "opponent", "pour", "immigrant", "first", "distribution", "golf", "pregnant", "unable", "alternative", "favorite", "stop", "violent", "portion", "acquire", "suicide", "stretch", "deficit", "symptom", "solar", "complaint", "capable", "analyze", "scared", "supporter", "dig", "twenty", "pretend", "philosophy", "childhood", "lower", "well", "outside", "dark", "wealth", "welfare", "poverty", "prosecutor", "spiritual", "double", "evaluate", "mass", "israeli", "shift", "reply", "buck", "display", "knife", "round", "tech", "detective", "pack", "disorder", "creature", "tear", "closely", "industrial", "housing", "watch", "chip", "regardless", "numerous", "tie", "range", "command", "shooting", "dozen", "pop", "layer", "bread", "exception", "passion", "block", "highway", "pure", "commander", "extreme", "publication", "vice", "fellow", "win", "mystery", "championship", "install", "tale", "liberty", "host", "beneath", "passenger", "physician", "graduate", "sharp", "substance", "atmosphere", "stir", "muslim", "passage", "pepper", "emphasize", "cable", "square", "recipe", "load", "beside", "roof", "vegetable", "accomplish", "silent", "habit", "discovery", "total", "recovery", "dna", "gain", "territory", "girlfriend", "consist", "straight", "surely", "proof", "nervous", "immediate", "parking", "sin", "unusual", "rice", "engineering", "advance", "interview", "bury", "still", "cake", "anonymous", "flag", "contemporary", "good", "jail", "rural", "match", "coach", "interpretation", "wage", "breakfast", "severe", "profile", "saving", "brief", "adjust", "reduction", "constantly", "assist", "bitch", "constant", "permit", "primarily", "entertainment", "shout", "academy", "teaspoon", "dream", "transfer", "usual", "ally", "clinical", "count", "swear", "avenue", "priest", "employment", "waste", "relax", "owe", "transform", "grass", "narrow", "ethnic", "scholar", "edition", "abandon", "practical", "infection", "musical", "suggestion", "resistance", "smoke", "prince", "illness", "embrace", "trade", "republic", "volunteer", "target", "general", "evaluation", "mine", "opposite", "awesome", "switch", "black", "iraqi", "iron", "perceive", "fundamental", "phrase", "assumption", "sand", "designer", "planning", "leading", "mode", "track", "respect", "widely", "occasion", "pose", "approximately", "retire", "elsewhere", "festival", "cap", "secure", "attach", "mechanism", "intention", "scenario", "yell", "incredible", "spanish", "strongly", "racial", "transportation", "pot", "boyfriend", "consideration", "prior", "retirement", "rarely", "joint", "doubt", "preserve", "enormous", "cigarette", "factory", "valuable", "clip", "electric", "giant", "slave", "submit", "effectively", "christian", "monitor", "wonder", "resolve", "remaining", "participation", "stream", "rid", "origin", "teen", "particular", "congressional", "bind", "coat", "tower", "license", "twitter", "impose", "innocent", "curriculum", "mail", "estimate", "insight", "investigator", "virus", "hurricane", "accurate", "provision", "strike", "communicate", "cross", "vary", "jacket", "increasing", "green", "equally", "pay", "light", "implication", "fiction", "protest", "mama", "imply", "twin", "pant", "another", "ahead", "bend", "shock", "exercise", "criteria", "arab", "dirty", "ring", "toy", "potentially", "assault", "peak", "anger", "boot", "dramatic", "peer", "enhance", "math", "slide", "favor", "pink", "dust", "aunt", "lost", "prospect", "mood", "settlement", "rather", "justify", "depth", "juice", "formal", "virtually", "gallery", "tension", "throat", "draft", "reputation", "index", "normally", "mess", "joy", "steel", "motor", "enterprise", "salary", "moreover", "giant", "cousin", "ordinary", "graduate", "dozen", "evolution", "helpful", "competitive", "lovely", "fishing", "anxiety", "professional", "carbon", "essay", "islamic", "honor", "drama", "odd", "evil", "stranger", "belt", "urge", "toss", "fifth", "formula", "potato", "monster", "smoke", "telephone", "rape", "palm", "jet", "navy", "excited", "plot", "angle", "criticize", "prisoner", "discipline", "negotiation", "damn", "butter", "desert", "complicated", "prize", "blind", "assign", "bullet", "awareness", "sequence", "illustrate", "drop", "pack", "provider", "fucking", "minor", "activist", "poem", "vacation", "weigh", "gang", "privacy", "clock", "arrange", "penalty", "stomach", "concert", "originally", "statistics", "electronic", "properly", "bureau", "wolf", "classic", "recommendation", "exciting", "maker", "dear", "impression", "broken", "battery", "narrative", "process", "arise", "kid", "sake", "delivery", "forgive", "visible", "heavily", "junior", "rep", "diversity", "string", "lawsuit", "latter", "cute", "deputy", "restore", "buddy", "psychological", "besides", "intense", "friendly", "evil", "lane", "hungry", "bean", "sauce", "print", "dominate", "testing", "trick", "fantasy", "absence", "offensive", "symbol", "recognition", "detect", "tablespoon", "construct", "hmm", "arrest", "approval", "aids", "whereas", "defensive", "independence", "apologize", "top", "asian", "rose", "ghost", "involvement", "permanent", "wire", "whisper", "mouse", "airline", "founder", "objective", "nowhere", "alternative", "phenomenon", "evolve", "not", "exact", "silver", "cent", "universal", "teenager", "crucial", "viewer", "schedule", "ridiculous", "chocolate", "sensitive", "bottom", "grandmother", "missile", "roughly", "constitutional", "adventure", "genetic", "advance", "related", "swing", "ultimate", "manufacturer", "unknown", "wipe", "crop", "survival", "line", "dimension", "resist", "request", "roll", "shape", "darkness", "guarantee", "historic", "educator", "rough", "personnel", "race", "confront", "terrorist", "royal", "elite", "occupy", "emphasis", "wet", "destruction", "raw", "inner", "proceed", "violate", "chart", "pace", "finance", "champion", "snap", "suspect", "advise", "initially", "advanced", "unlikely", "barrier", "advocate", "label", "access", "horrible", "burden", "violation", "unlike", "idiot", "lifetime", "working", "fund", "ongoing", "react", "routine", "presentation", "supply", "gear", "photograph", "mexican", "stadium", "translate", "mortgage", "sheriff", "clinic", "spin", "coalition", "naturally", "hopefully", "mix", "menu", "smooth", "advertising", "interpret", "plant", "dismiss", "muslim", "apparent", "arrangement", "incorporate", "split", "brilliant", "storage", "framework", "honestly", "chase", "sigh", "assure", "utility", "taste", "aggressive", "cookie", "terror", "free", "worth", "wealthy", "update", "forum", "alliance", "possess", "empire", "curious", "corn", "neither", "calculate", "hurry", "testimony", "elementary", "transfer", "stake", "precisely", "bite", "given", "substantial", "depending", "glance", "tissue", "concentration", "developer", "found", "ballot", "consume", "overcome", "biological", "chamber", "similarly", "stick", "dare", "developing", "tiger", "ratio", "lover", "expansion", "encounter", "occasionally", "unemployment", "pet", "awful", "laboratory", "administrator", "wind", "quarterback", "rocket", "preparation", "relative", "confident", "strategic", "marine", "quote", "publisher", "innovation", "highlight", "nut", "fighter", "rank", "electricity", "instance", "fortune", "freeze", "variation", "armed", "negotiate", "laughter", "wisdom", "correspondent", "mixture", "murder", "assistant", "retain", "tomato", "indian", "testify", "ingredient", "since", "galaxy", "qualify", "scheme", "gop", "shame", "concentrate", "contest", "introduction", "boundary", "tube", "versus", "chef", "regularly", "ugly", "screw", "load", "tongue", "palestinian", "fiscal", "creek", "hip", "accompany", "decline", "terrorism", "respondent", "narrator", "voting", "refugee", "assembly", "fraud", "limitation", "house", "partnership", "store", "crash", "surprise", "representation", "hold", "ministry", "flat", "wise", "witness", "excuse", "register", "comedy", "purchase", "tap", "infrastructure", "organic", "islam", "diverse", "favor", "intellectual", "tight", "port", "fate", "market", "absolute", "dialogue", "plus", "frequency", "tribe", "external", "appointment", "convert", "surprising", "mobile", "establishment", "worried", "bye", "shopping", "celebrity", "congressman", "impress", "taxpayer", "adapt", "publicly", "pride", "clothing", "rapidly", "domain", "mainly", "ceiling", "alter", "shelter", "random", "obligation", "shower", "beg", "asleep", "musician", "extraordinary", "dirt", "bell", "smell", "damage", "ceremony", "clue", "guideline", "comfort", "near", "pregnancy", "borrow", "conventional", "tourist", "incentive", "custom", "cheek", "tournament", "double", "satellite", "nearby", "comprehensive", "stable", "medication", "script", "educate", "efficient", "risk", "welcome", "scare", "psychology", "logic", "economics", "update", "nevertheless", "devil", "thirty", "beat", "charity", "fiber", "wave", "ideal", "friendship", "net", "motivation", "differently", "reserve", "observer", "humanity", "survivor", "fence", "quietly", "humor", "major", "funeral", "spokesman", "extension", "loose", "sink", "historian", "ruin", "balance", "chemical", "singer", "drunk", "swim", "onion", "specialist", "missing", "white", "pan", "distribute", "silly", "deck", "reflection", "shortly", "database", "flow", "remote", "permission", "remarkable", "everyday", "lifestyle", "sweep", "naked", "sufficient", "lion", "consumption", "capability", "practice", "emission", "sidebar", "crap", "dealer", "measurement", "vital", "impressive", "bake", "fantastic", "adviser", "yield", "mere", "imagination", "radical", "tragedy", "scary", "consultant", "correct", "lieutenant", "upset", "attractive", "acre", "drawing", "defeat", "newly", "scandal", "ambassador", "ooh", "spot", "content", "round", "bench", "guide", "counter", "chemical", "odds", "rat", "horror", "appeal", "vulnerable", "prevention", "square", "segment", "ban", "tail", "constitute", "badly", "bless", "literary", "magic", "implementation", "legitimate", "slight", "crash", "strip", "desperate", "distant", "preference", "politically", "feedback", "criminal", "can", "italian", "detailed", "buyer", "wrong", "cooperation", "profession", "incredibly", "orange", "killing", "sue", "photographer", "running", "engagement", "differ", "paint", "pitch", "extensive", "salad", "stair", "notice", "grace", "divorce", "vessel", "pig", "assignment", "distinction", "fit", "circuit", "acid", "canadian", "flee", "efficiency", "memorial", "proposed", "blue", "entity", "iphone", "punishment", "pause", "pill", "rub", "romantic", "myth", "economist", "latin", "decent", "assistant", "craft", "poetry", "terrorist", "thread", "wooden", "confuse", "subject", "privilege", "coal", "fool", "cow", "characterize", "pie", "decrease", "resort", "legacy", "stress", "frankly", "matter", "cancel", "derive", "dumb", "scope", "formation", "grandfather", "hence", "wish", "margin", "wound", "exhibition", "legislature", "furthermore", "portrait", "catholic", "sustain", "uniform", "painful", "loud", "miracle", "harm", "zero", "tactic", "mask", "calm", "inflation", "hunting", "physically", "final", "flesh", "temporary", "fellow", "nerve", "lung", "steady", "headline", "sudden", "successfully", "defendant", "pole", "satisfy", "entrance", "aircraft", "withdraw", "cabinet", "relative", "repeatedly", "happiness", "admission", "correlation", "proportion", "dispute", "candy", "reward", "counselor", "recording", "pile", "explosion", "appoint", "couch", "cognitive", "furniture", "significance", "grateful", "magic", "suit", "commissioner", "shelf", "tremendous", "warrior", "physics", "garage", "flavor", "squeeze", "prominent", "fifty", "fade", "oven", "satisfaction", "discrimination", "recession", "allegation", "boom", "weekly", "lately", "restriction", "diamond", "document", "crack", "conviction", "heel", "fake", "fame", "shine", "swing", "playoff", "actress", "cheat", "format", "controversy", "auto", "grant", "grocery", "headquarters", "rip", "rank", "shade", "regulate", "meter", "olympic", "pipe", "patient", "celebration", "handful", "copyright", "dependent", "signature", "bishop", "strengthen", "soup", "entitle", "whoever", "carrier", "anniversary", "pizza", "ethics", "legend", "eagle", "scholarship", "crack", "research", "membership", "standing", "possession", "treaty", "partly", "consciousness", "manufacturing", "announcement", "tire", "makeup", "pop", "prediction", "stability", "trace", "norm", "irish", "genius", "gently", "operator", "mall", "rumor", "poet", "tendency", "subsequent", "alien", "explode", "cool", "controversial", "maintenance", "courage", "exceed", "tight", "principal", "vaccine", "identification", "sandwich", "bull", "lens", "twelve", "mainstream", "presidency", "integrity", "distinct", "intelligent", "secondary", "bias", "hypothesis", "fifteen", "nomination", "delay", "adjustment", "sanction", "render", "shop", "acceptable", "mutual", "high", "examination", "meaningful", "communist", "superior", "currency", "collective", "tip", "flame", "guitar", "doctrine", "palestinian", "float", "commerce", "invent", "robot", "rapid", "plain", "respectively", "particle", "across", "glove", "till", "edit", "moderate", "jazz", "infant", "summary", "server", "leather", "radiation", "prompt", "function", "composition", "operating", "assert", "case", "discourse", "loud", "dump", "net", "wildlife", "soccer", "complex", "mandate", "monitor", "downtown", "nightmare", "barrel", "homeless", "globe", "uncomfortable", "execute", "feel", "trap", "gesture", "pale", "tent", "receiver", "horizon", "diagnosis", "considerable", "gospel", "automatically", "fighting", "stroke", "wander", "duck", "grain", "beast", "concern", "remark", "fabric", "civilization", "warm", "corruption", "collapse", "greatly", "workshop", "inquiry", "admire", "exclude", "rifle", "closet", "reporting", "curve", "patch", "touchdown", "experimental", "earnings", "hunter", "fly", "tunnel", "corps", "behave", "rent", "german", "motivate", "attribute", "elderly", "virtual", "minimum", "weakness", "progressive", "doc", "medium", "virtue", "ounce", "collapse", "delay", "athletic", "confusion", "legislative", "facilitate", "midnight", "deer", "way", "undergo", "heritage", "summit", "sword", "telescope", "donate", "blade", "toe", "agriculture", "park", "enforce", "recruit", "favor", "dose", "concerning", "integrate", "rate", "pitch", "prescription", "retail", "adoption", "monthly", "deadly", "grave", "rope", "reliable", "label", "transaction", "lawn", "consistently", "mount", "bubble", "briefly", "absorb", "princess", "log", "blanket", "laugh", "kingdom", "anticipate", "bug", "primary", "dedicate", "nominee", "transformation", "temple", "sense", "arrival", "frustration", "changing", "demonstration", "pollution", "poster", "nail", "nonprofit", "cry", "guidance", "exhibit", "pen", "interrupt", "lemon", "bankruptcy", "resign", "dominant", "invasion", "sacred", "replacement", "portray", "hunt", "distinguish", "melt", "consensus", "kiss", "french", "hardware", "rail", "cold", "mate", "dry", "korean", "cabin", "dining", "liberal", "snake", "tobacco", "orientation", "trigger", "wherever", "seize", "abuse", "mess", "punish", "sexy", "depict", "input", "seemingly", "widespread", "competitor", "flip", "freshman", "donation", "administrative", "donor", "gradually", "overlook", "toilet", "pleased", "resemble", "ideology", "glory", "maximum", "organ", "skip", "starting", "brush", "brick", "gut", "reservation", "rebel", "disappointed", "oak", "valid", "instructor", "rescue", "racism", "pension", "diabetes", "overall", "cluster", "eager", "marijuana", "combat", "praise", "costume", "sixth", "frequent", "inspiration", "orange", "concrete", "cooking", "conspiracy", "trait", "van", "institutional", "garlic", "drinking", "response", "crystal", "stretch", "pro", "associate", "helicopter", "counsel", "equation", "roman", "sophisticated", "timing", "pope", "opera", "ethical", "mount", "indication", "motive", "porch", "reinforce", "gaze", "ours", "lap", "written", "reverse", "starter", "injure", "chronic", "continued", "exclusive", "colonel", "copy", "beef", "abroad", "thanksgiving", "intensity", "desire", "cave", "basement", "associated", "unlike", "fascinating", "interact", "illustration", "daily", "essence", "container", "driving", "stuff", "dynamic", "gym", "bat", "plead", "promotion", "uncertainty", "ownership", "officially", "tag", "documentary", "stem", "flood", "guilt", "inside", "alarm", "turkey", "conduct", "diagnose", "precious", "swallow", "initiate", "fitness", "restrict", "gulf", "advocate", "mommy", "unexpected", "shrug", "agricultural", "sacrifice", "spectrum", "dragon", "bacteria", "shore", "pastor", "cliff", "ship", "adequate", "rape", "addition", "tackle", "occupation", "compose", "slice", "brave", "military", "stimulus", "patent", "powder", "harsh", "chaos", "kit", "this", "piano", "surprisingly", "lend", "correctly", "project", "govern", "modest", "shared", "psychologist", "servant", "overwhelming", "elevator", "hispanic", "divine", "transmission", "butt", "commonly", "cowboy", "ease", "intent", "counseling", "gentle", "rhythm", "short", "complexity", "nonetheless", "effectiveness", "lonely", "statistical", "longtime", "strain", "firm", "garbage", "devote", "speed", "venture", "lock", "aide", "subtle", "rod", "top", "civilian", "endure", "civilian", "basket", "strict", "loser", "franchise", "saint", "aim", "prosecution", "bite", "lyrics", "compound", "architecture", "reach", "destination", "cope", "province", "sum", "lecture", "spill", "genuine", "upstairs", "protest", "trading", "please", "acceptance", "revelation", "march", "indicator", "collaboration", "rhetoric", "tune", "slam", "inevitable", "monkey", "till", "protocol", "productive", "principal", "finish", "jeans", "companion", "convict", "boost", "recipient", "practically", "array", "persuade", "undermine", "yep", "ranch", "scout", "medal", "endless", "translation", "ski", "conservation", "habitat", "contractor", "trailer", "pitcher", "towel", "goodbye", "harm", "bonus", "dramatically", "genre", "caller", "exit", "hook", "behavioral", "omit", "pit", "volunteer", "boring", "hook", "suspend", "cholesterol", "closed", "advertisement", "bombing", "consult", "encounter", "expertise", "creator", "peaceful", "upset", "provided", "tablet", "blow", "ruling", "launch", "warming", "equity", "rational", "classic", "utilize", "pine", "past", "bitter", "guard", "surgeon", "affordable", "tennis", "artistic", "download", "suffering", "accuracy", "literacy", "treasury", "talented", "crown", "importantly", "bare", "invisible", "sergeant", "regulatory", "thumb", "colony", "walking", "accessible", "damn", "integration", "spouse", "award", "excitement", "residence", "bold", "adolescent", "greek", "doll", "oxygen", "finance", "gravity", "functional", "palace", "echo", "cotton", "rescue", "estimated", "program", "endorse", "lawmaker", "determination", "flash", "simultaneously", "dynamics", "shell", "hint", "frame", "administer", "rush", "christianity", "distract", "ban", "alleged", "statute", "value", "biology", "republican", "follower", "nasty", "evident", "prior", "confess", "eligible", "picture", "rock", "trap", "consent", "pump", "down", "bloody", "hate", "occasional", "trunk", "prohibit", "sustainable", "belly", "banking", "asshole", "journalism", "flash", "average", "obstacle", "ridge", "heal", "bastard", "cheer", "apology", "tumor", "architect", "wrist", "harbor", "handsome", "bullshit", "realm", "bet", "twist", "inspector", "surveillance", "trauma", "rebuild", "romance", "gross", "deadline", "age", "classical", "convey", "compensation", "insect", "debate", "output", "parliament", "suite", "opposed", "fold", "separation", "demon", "eating", "structural", "besides", "equality", "logical", "probability", "await", "generous", "acquisition", "custody", "compromise", "greet", "trash", "judicial", "earthquake", "insane", "realistic", "wake", "assemble", "necessity", "horn", "parameter", "grip", "modify", "signal", "sponsor", "mathematics", "hallway", "any", "liability", "crawl", "theoretical", "condemn", "fluid", "homeland", "technological", "exam", "anchor", "spell", "considering", "conscious", "vitamin", "known", "hostage", "reserve", "actively", "mill", "teenage", "respect", "retrieve", "processing", "sentiment", "offering", "oral", "convinced", "photography", "coin", "laptop", "bounce", "goodness", "affiliation", "punch", "burst", "bee", "blessing", "command", "continuous", "above", "landing", "repair", "worry", "ritual", "bath", "sneak", "historically", "mud", "scan", "reminder", "hers", "slavery", "supervisor", "quantity", "olympics", "pleasant", "slope", "skirt", "outlet", "curtain", "declaration", "seal", "immune", "switch", "calendar", "paragraph", "identical", "credit", "regret", "quest", "flat", "entrepreneur", "specify", "stumble", "clay", "noon", "last", "strip", "elbow", "outstanding", "unity", "rent", "manipulate", "airplane", "portfolio", "mysterious", "delicious", "northwest", "sweat", "profound", "sacrifice", "treasure", "flour", "lightly", "rally", "default", "alongside", "plain", "hug", "isolate", "exploration", "secure", "limb", "enroll", "outer", "charter", "southwest", "escape", "arena", "witch", "upcoming", "forty", "someday", "unite", "courtesy", "statue", "fist", "castle", "precise", "squad", "cruise", "joke", "legally", "embassy", "patience", "medium", "thereby", "bush", "purple", "peer", "electrical", "outfit", "cage", "retired", "shark", "lobby", "sidewalk", "near", "runner", "ankle", "attraction", "fool", "artificial", "mercy", "indigenous", "slap", "tune", "dancer", "candle", "sexually", "needle", "hidden", "chronicle", "suburb", "toxic", "underlying", "sensor", "deploy", "debut", "star", "magnitude", "suspicion", "pro", "colonial", "icon", "grandma", "info", "jurisdiction", "iranian", "senior", "parade", "seal", "archive", "gifted", "rage", "outdoor", "ending", "loop", "altogether", "chase", "burning", "reception", "local", "crush", "premise", "deem", "automatic", "whale", "mechanical", "credibility", "drain", "drift", "loyalty", "promising", "tide", "traveler", "grief", "metaphor", "skull", "pursuit", "therapist", "backup", "workplace", "instinct", "export", "bleed", "shock", "seventh", "fixed", "broadcast", "disclose", "execution", "pal", "chuckle", "pump", "density", "correction", "representative", "jump", "repair", "kinda", "relieve", "teammate", "brush", "corridor", "russian", "enthusiasm", "extended", "root", "alright", "panic", "pad", "bid", "mild", "productivity", "guess", "tuck", "defeat", "railroad", "frozen", "minimize", "amid", "inspection", "cab", "expected", "nonsense", "leap", "draft", "rider", "theology", "terrific", "accent", "invitation", "reply", "israeli", "liar", "oversee", "awkward", "registration", "suburban", "handle", "momentum", "instantly", "clerk", "chin", "hockey", "laser", "proposition", "rob", "beam", "ancestor", "creativity", "verse", "casual", "objection", "clever", "given", "shove", "revolutionary", "carbohydrate", "steam", "reportedly", "glance", "forehead", "resume", "slide", "sheep", "good", "carpet", "cloth", "interior", "running", "questionnaire", "compromise", "departure", "behalf", "graph", "diplomatic", "thief", "herb", "subsidy", "cast", "fossil", "patrol", "pulse", "mechanic", "cattle", "screening", "continuing", "electoral", "supposedly", "dignity", "prophet", "commentary", "sort", "spread", "serving", "safely", "homework", "allegedly", "android", "alpha", "insert", "mortality", "contend", "elephant", "solely", "hurt", "continent", "attribute", "ecosystem", "leave", "nearby", "olive", "syndrome", "minimum", "catch", "abstract", "accusation", "coming", "sock", "pickup", "shuttle", "improved", "calculation", "innovative", "demographic", "accommodate", "jaw", "unfair", "tragic", "comprise", "faster", "nutrition", "mentor", "stance", "rabbit", "pause", "dot", "contributor", "cooperate", "disk", "hesitate", "regard", "offend", "exploit", "compel", "likelihood", "sibling", "southeast", "gorgeous", "undertake", "painter", "residential", "counterpart", "believer", "lamp", "inmate", "thoroughly", "trace", "freak", "filter", "pillow", "orbit", "purse", "likewise", "cease", "passing", "feed", "vanish", "instructional", "clause", "mentally", "model", "left", "pond", "neutral", "shield", "popularity", "cartoon", "authorize", "combined", "exhibit", "sink", "graphic", "darling", "traditionally", "vendor", "poorly", "conceive", "opt", "descend", "firmly", "beloved", "openly", "gathering", "alien", "stem", "fever", "preach", "interfere", "arrow", "required", "capitalism", "kick", "fork", "survey", "meantime", "presumably", "position", "racist", "stay", "illusion", "removal", "anxious", "arab", "organism", "awake", "sculpture", "spare", "marine", "harassment", "drum", "diminish", "helmet", "level", "certificate", "tribal", "bad", "mmm", "sadly", "cart", "spy", "sunlight", "delete", "rookie", "clarify", "hunger", "practitioner", "performer", "protective", "jar", "programming", "dawn", "salmon", "census", "pick", "accomplishment", "conscience", "fortunately", "minimal", "molecule", "supportive", "sole", "threshold", "inventory", "comply", "monetary", "transport", "shy", "drill", "influential", "verbal", "reward", "ranking", "gram", "grasp", "puzzle", "envelope", "heat", "classify", "enact", "unfortunate", "scatter", "cure", "time", "dear", "slice", "readily", "damn", "discount", "addiction", "emerging", "worthy", "marker", "juror", "mention", "blend", "businessman", "premium", "retailer", "charge", "liver", "pirate", "protester", "outlook", "elder", "gallon", "additionally", "ignorance", "chemistry", "sometime", "weed", "babe", "fraction", "cook", "conversion", "object", "tolerate", "trail", "drown", "merit", "citizenship", "coordinator", "validity", "european", "lightning", "turtle", "ambition", "worldwide", "sail", "added", "delicate", "comic", "soap", "hostile", "instruct", "shortage", "useless", "booth", "diary", "gasp", "suspicious", "transit", "excite", "publishing", "curiosity", "grid", "rolling", "bow", "cruel", "disclosure", "rival", "denial", "secular", "flood", "speculation", "sympathy", "tender", "inappropriate", "sodium", "divorce", "spring", "bang", "challenging", "ipad", "sack", "barn", "reliability", "hormone", "footage", "carve", "alley", "ease", "coastal", "cafe", "partial", "flexible", "experienced", "mixed", "vampire", "optimistic", "dessert", "northeast", "specialize", "fleet", "availability", "compliance", "pin", "pork", "astronomer", "like", "forbid", "installation", "boil", "nest", "exclusively", "goat", "shallow", "equip", "equivalent", "betray", "willingness", "banker", "interval", "gasoline", "encouraging", "rain", "exchange", "bucket", "theft", "laundry", "constraint", "dying", "hatred", "jewelry", "migration", "invention", "loving", "revenge", "unprecedented", "outline", "sheer", "halloween", "sweetheart", "spit", "lazy", "intimate", "defender", "technically", "battle", "cure", "peanut", "unclear", "piss", "workout", "wilderness", "compelling", "eleven", "arm", "backyard", "alike", "partially", "transport", "guardian", "passionate", "scripture", "midst", "ideological", "apart", "thrive", "sensitivity", "trigger", "emotionally", "ignorant", "explicitly", "unfold", "headache", "eternal", "chop", "ego", "spectacular", "deposit", "verdict", "regard", "accountability", "nominate", "civic", "uncover", "critique", "aisle", "tropical", "annually", "eighth", "blast", "corrupt", "compassion", "scratch", "verify", "offender", "inherit", "strive", "downtown", "chunk", "appreciation", "canvas", "punch", "proceedings", "magical", "loyal", "aah", "desperately", "throne", "brutal", "spite", "propaganda", "irony", "soda", "projection", "dutch", "parental", "disabled", "collector", "disappointment", "comic", "aid", "happily", "steep", "fancy", "counter", "listener", "whip", "public", "drawer", "heck", "developmental", "ideal", "ash", "socially", "courtroom", "stamp", "solo", "trainer", "induce", "anytime", "morality", "syrian", "pipeline", "bride", "instant", "spark", "doorway", "interface", "learner", "casino", "placement", "cord", "fan", "conception", "flexibility", "thou", "tax", "elegant", "flaw", "locker", "peel", "campaign", "twist", "spell", "objective", "plea", "goddamn", "import", "stack", "gosh", "philosophical", "junk", "bicycle", "vocal", "chew", "destiny", "ambitious", "unbelievable", "vice", "halfway", "jealous", "sphere", "invade", "sponsor", "excessive", "countless", "sunset", "interior", "accounting", "faithful", "freely", "extract", "adaptation", "ray", "depressed", "emperor", "wagon", "columnist", "jungle", "embarrassed", "trillion", "breeze", "blame", "foster", "venue", "discourage", "disturbing", "riot", "isolation", "explicit", "commodity", "attendance", "tab", "consequently", "dough", "novel", "streak", "silk", "similarity", "steak", "dancing", "petition", "viable", "breathing", "balloon", "monument", "try", "cue", "sleeve", "toll", "reluctant", "warrant", "stiff", "tattoo", "softly", "sudden", "graduation", "japanese", "deliberately", "consecutive", "upgrade", "associate", "accurately", "strictly", "leak", "casualty", "risky", "banana", "blank", "beneficial", "shrink", "chat", "rack", "rude", "usage", "testament", "browser", "processor", "thigh", "perceived", "yield", "talking", "merchant", "quantum", "eyebrow", "surrounding", "vocabulary", "ashamed", "radar", "stunning", "murderer", "burger", "collar", "align", "textbook", "sensation", "afterward", "charm", "sunny", "hammer", "keyboard", "persist", "wheat", "predator", "bizarre"]


// const words = ["administration"]

const view = new View();
const game = new Hangman_Game_Model(players, words);
const presenter = new Presenter(view, game);