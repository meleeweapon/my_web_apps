interface Table_HTML {
  table: HTMLElement;
  tiles: [
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement
  ];
}

class Table_HTML {
  table: HTMLElement;
  tiles: [
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement
  ];

  constructor(table, tiles) {
    if (table == null) throw new Error();
    if (tiles == null) throw new Error();

    this.table = table;

    const tile_array = Array.from(tiles);
    if (tile_array.length !== 9) throw new Error();
    this.tiles = tiles;
  }
}

// interface View {
  
// }

class View {
  public table: Table_HTML;
  public winner_element: HTMLElement;
  public winner_name_element: HTMLElement;

  constructor(
    table: Table_HTML, winner_element: HTMLElement | null,
    winner_name_element: HTMLElement | null
  ) {
    this.table = table;

    if (winner_element == null) throw new Error("winner_element");
    this.winner_element = winner_element;

    if (winner_name_element == null) throw new Error("winner_name_element");
    this.winner_name_element = winner_name_element;
  }

  public render_tiles(tiles: Tile[]) {
    for (const i in tiles) {
      if (!tiles[i].value) continue;
      this.table.tiles[i].style.background = tiles[i].value.color;
    }
  }

  public render_winner(player: Player | null) {
    if (player == null) {
      this.winner_element.textContent = `Draw`;
      return;
    }
    this.winner_element.textContent = "Winner is ";
    this.winner_name_element.style.color = player?.color;
    this.winner_name_element.textContent = player?.name;
  }

  public handle(tile_element: HTMLElement, callback: Function, context) {
    tile_element.addEventListener("click", () => {
      callback.call(context, tile_element);
    })
  }
}

function index_to_row_and_col(index: number): {row: number, column: number} {
  return {row: Math.floor(index / 3), column: index % 3};
}

class Controller {
  private view: View;
  private game: TicTacToe_Game_Model;
  private playing: boolean;

  constructor(view: View, game: TicTacToe_Game_Model) {
    this.view = view;
    this.game = game;
    this.playing = true;

    for (const element of this.view.table.tiles) {
      this.view.handle(element, this.tile_action, this);
    }
  }

  public tile_action(tile_element: HTMLElement) {
    if (!this.playing) return;
    const row_and_col = index_to_row_and_col(parseInt(tile_element.id[tile_element.id.length - 1]) - 1);
    this.game.player_action(row_and_col.row, row_and_col.column, this.game.turn);
    let winner = this.game.win_condition();
    if (winner) {
      this.playing = false;
      this.view.render_winner(winner.value);
    }
    if (this.game.empty_tiles().length === 0) {
      this.playing = false;
      this.view.render_winner(winner);
    }
    this.view.render_tiles(this.game.board.tiles);
  }

}

interface Player {
  name: string;
  color: string;
}

// interface Tile {
//   value: null | Player;
// }

class Tile {
  private _value: null | Player;

  constructor() {
    this._value = null;
  }

  public get value() {
    return this._value;
  }

  public set value(value: null | Player) {
    if (value === null) return;
    if (this.value !== null) return;
    this._value = value;
  }
}

// class PlayerArray {
//   players: Player[];

//   constructor(players: Player[]) {
//     this.players = players;
//   }

//   next(): Player {

//   }
// }

class Board {
  tiles: Tile[];

  constructor(tiles: Tile[]) {
    this.tiles = tiles;
  }

  get_row(row: number): Tile[] {
    const first_index = row * 3;
    return [this.tiles[first_index], this.tiles[first_index + 1], this.tiles[first_index + 2]];
  }

  get_column(column: number): Tile[] {
    const first_index = column;
    return [this.tiles[first_index], this.tiles[first_index + 3], this.tiles[first_index + 6]];
  }

  get_diagonal(direction: "on_origin" | "alt"): Tile[] {
    if (direction === "on_origin") {
      return [this.tiles[0], this.tiles[4], this.tiles[8]];
    } else {
      return [this.tiles[2], this.tiles[4], this.tiles[6]];
    }
  }

  get_tile(row: number, column: number): Tile {
    const index = (row * 3) + column;
    return this.tiles[index];
  }
}

function all_same(arr) {
  return arr.reduce((p, c) => {
    if (p === null) return p;
    if (p.value === null) return null;
    return p.value != c.value ? null : c;
  })
}


class TicTacToe_Game_Model {
  public players: Player[];
  public turn: Player;
  public board: Board;

  constructor(players: Player[], board: Board) {
    this.players = players;
    this.board = board;

    this.turn = this.players[0];
  }

  public next_turn(): Player {
    const index = this.players.indexOf(this.turn);
    if (index === this.players.length - 1) 
      return  this.players[0];
    return this.players[index + 1];
  }

  public player_action(row: number, column: number, turn: Player) {
    if (turn != this.turn) return;
    const tile = this.board.get_tile(row, column);
    if (tile.value !== null) return;
    tile.value = turn;
    this.turn = this.next_turn();
  }

  public win_condition(): Tile | null {
    for (let i = 0; i < 3; i += 1) {
      const winner = all_same(this.board.get_row(i));
      if (winner) return winner;
    }
    for (let i = 0; i < 3; i += 1) {
      const winner = all_same(this.board.get_column(i));
      if (winner) return winner;
    }
    {const winner = all_same(this.board.get_diagonal("on_origin"));
    if (winner) return winner;}
    {const winner = all_same(this.board.get_diagonal("alt"));
    if (winner) return winner;}
    return null;
  }

  public empty_tiles() {
    return this.board.tiles.filter(e => e.value == null);
  }
}


const table = new Table_HTML(
  document.querySelector(".board"), 
  document.querySelectorAll(".tile")
)

const players = [{name: "booba", color: "#00ff00"}, {name: "awooga", color: "#0000ff"}];

const tiles = [
  new Tile(), new Tile(), new Tile(), 
  new Tile(), new Tile(), new Tile(), 
  new Tile(), new Tile(), new Tile()
];

const board = new Board(tiles);

const view: View = new View(table, document.querySelector(".winner"), document.querySelector(".name"));
const game: TicTacToe_Game_Model = new TicTacToe_Game_Model(players, board);
const controller: Controller = new Controller(view, game);