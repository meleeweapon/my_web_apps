const buttons: NodeListOf<HTMLDivElement> | null = document.querySelectorAll(".ttt-main > div");

type Turn = "first_player" | "second_player";
type Table = HTMLDivElement[][];

let turn: Turn = "first_player";

const buttons_matrix: Table = []
for (let row = 0; row < 3; row++) {
  buttons_matrix.push([])
  for (let col = row*3; col < row*3+3; col++) {
    buttons_matrix[row].push(buttons[col]);
  }
};

const event_listeners = []

for (const elem of buttons) {
  event_listeners.push((e) => {
  if (turn == "first_player") {
    elem.style.background = "green";
    turn = "second_player";
  } else {
    elem.style.background = "blue";
    turn = "first_player";
  };

  const win_cond = check_win_condition(buttons_matrix);
  console.log(win_cond);
  if (win_cond) {
    const chl = document.createElement("div")
    chl.textContent = "Game over.";
    chl.style.fontSize = "72px";
    document.querySelector("body")?.appendChild(chl);
    for (let i = 0; i < buttons.length; i++) 
      buttons[i].removeEventListener("click", event_listeners[i]);

  }})
};


for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", event_listeners[i]);
};

function all_same(iterable): boolean {
  const first = iterable[0]
  if (first === "") return false;
  for (const item of iterable) {
    // console.log(first, item);
    if (item !== first) return false;
  }
  return true;
}

function check_win_condition(table: Table): boolean {
  // check rows
  for (const row of table) {
    const is_win = all_same(row.map(elem => elem.style.background));
    if (is_win) return is_win;
  }

  // check columns
  for (let col = 0; col < table.length; col++) {
    const column = [];
    for (let row = 0; row < 3; row++) column.push(table[row][col]);
    const is_win = all_same(column.map(elem => elem.style.background));
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
    row > 0 && col < table[0].length; 
    row--, col++
  ) cross_2.push(table[row][col])
  const is_win_2 = all_same(cross_2.map(elem => elem.style.background));
  if (is_win_2) return is_win_2;
  
  return false;
};

// for (const elem of buttons) {
//   elem.addEventListener("click", (e) => {
//     elem.
//   }); 
// }