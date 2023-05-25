interface Table_HTML {
  table: HTMLElement;
  tiles: [
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement, 
    HTMLElement, HTMLElement, HTMLElement
  ];
}

// interface View {
  
// }

class View {
  public table: Table_HTML;

  constructor(table: Table_HTML) {
    this.table = table;
  }

  public render(tiles: Tile[]) {
    for (const i in tiles) {
      if (!tiles[i].value) continue;
      this.table.tiles[i].style.background = tiles[i].value.color;
    }
  }
}

class Controller {
  private view: View;
  private game: TicTacToe_Game_Model;

  
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
    if (p == null) return null;
    return p != c ? null : c;
  })
}


class TicTacToe_Game_Model {
  public players: Player[];
  public turn: Player;
  public board: Board;

  constructor(players: Player[], board: Board) {
    this.players = players;
    this.board = board;
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
    tile.value = turn;
    this.turn = this.next_turn();
  }

  public win_condition() {
    for (let i = 0; i < 3; i += 1) {
      if (all_same(this.board.get_row(i))) return true;
    }
    for (let i = 0; i < 3; i += 1) {
      if (all_same(this.board.get_column(i))) return true;
    }
    if (all_same(this.board.get_diagonal("on_origin"))) return true;
    if (all_same(this.board.get_diagonal("alt"))) return true;
    return false;
  }

  public empty_tiles() {
    return this.board.tiles.filter(e => e.value == null);
  }
}

const view: View = new View();
const game: TicTacToe_Game_Model = new TicTacToe_Game_Model();
const controller: Controller = new Controller(view, game);