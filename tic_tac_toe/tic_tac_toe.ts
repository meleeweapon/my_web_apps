const buttons: Element[] = [...document.querySelectorAll(".ttt-main > div")];

type Turn = "first_player" | "second_player";
type Table = Element[][];
type GameState = "playing" | "finished";
type Winner = "none" | "draw" | "player 1" | "player 2";

let turn: Turn = "first_player";
let game_state: GameState = "playing";
let winner: Winner = "none";

const buttons_matrix: Table = []
for (let row = 0; row < 3; row++) {
  buttons_matrix.push([])
  for (let col = row*3; col < row*3+3; col++) {
    buttons_matrix[row].push(buttons[col]);
  }
};

const event_listeners = [];

function button_evlistener(elem) {
  return function (e) {
    if (game_state === "finished") {
      return;
    }

    let bg = elem.style.background
    if (turn == "first_player") {
      if (bg !== "") {
        return;
      }

      elem.style.background = "green";
      turn = "second_player";

    } else {
      if (bg !== "") {
        return;
      }

      elem.style.background = "blue";
      turn = "first_player";
    };

    const win_cond = check_win_condition(buttons_matrix);
    console.log(win_cond);
    if (win_cond) {
      const chl = document.createElement("div");

      chl.textContent = "Game over.";
      if (win_cond === "green") {
        chl.textContent += " Player 1 won."
      } else {
        chl.textContent += " Player 2 won."
      }
      chl.style.fontSize = "72px";
      document.querySelector("body")?.appendChild(chl);
      game_state = "finished";

      // for (let i = 0; i < buttons.length; i++) 
      //   buttons[i].removeEventListener("click", event_listeners[i]);
    }

    const draw_condition = !(buttons.some(e => (e.style.background === ""))) && !win_cond;
    console.log(draw_condition, buttons.some(e => (e.style.background !== "")), !win_cond);
    if (draw_condition) {
      const chl = document.createElement("div");
      chl.textContent = "Game over. Draw";
      chl.style.fontSize = "72px";
      document.querySelector("body")?.appendChild(chl);
      game_state = "finished";
    }
  }
}

for (const elem of buttons) {
  event_listeners.push(button_evlistener(elem));
};


for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", event_listeners[i]);
};

function all_same(iterable): string | null {
  const first = iterable[0]
  if (first === "") return null;
  for (const item of iterable) {
    // console.log(first, item);
    if (item !== first) return null;
  }
  return first;
}

function check_win_condition(table: Table): string | null {
  // check rows
  for (const row of table) {
    const is_win = all_same(row.map(elem => elem.style.background));
    if (is_win) return is_win;
  }

  // check columns
  for (let col = 0; col < table.length; col++) {
    const column = [];
    for (let row = 0; row < 3; row++) column.push(table[row][col]);
    const is_win = all_same(column.map((elem: HTMLElement) => elem.style.background));
    if (is_win) return is_win;
  }

  // check crosses
  const cross = []
  for (
    let row = 0, col = 0; 
    row < table.length && col < table[0].length; 
    row++, col++
  ) cross.push(table[row][col])
  const is_win = all_same(cross.map(elem => elem.style.background));
  if (is_win) return is_win;

  const cross_2 = []
  for (
    let row = 2, col = 0; 
    row >= 0 && col < table[0].length; 
    row--, col++
  ) cross_2.push(table[row][col])
  const is_win_2 = all_same(cross_2.map((elem: HTMLElement) => elem.style.background));
  if (is_win_2) return is_win_2;
  
  return null;
};

// for (const elem of buttons) {
//   elem.addEventListener("click", (e) => {
//     elem.
//   }); 
// }