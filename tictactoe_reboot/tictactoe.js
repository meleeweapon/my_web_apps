// interface Table_HTML_Interface {
//   table: HTMLElement;
//   tiles: [
//     HTMLElement, HTMLElement, HTMLElement, 
//     HTMLElement, HTMLElement, HTMLElement, 
//     HTMLElement, HTMLElement, HTMLElement
//   ];
// }
var Table_HTML = /** @class */ (function () {
    function Table_HTML(table, tiles) {
        if (table == null)
            throw new Error();
        if (tiles == null)
            throw new Error();
        this.table = table;
        var tile_array = Array.from(tiles);
        if (tile_array.length !== 9)
            throw new Error();
        this.tiles = tiles;
    }
    return Table_HTML;
}());
// interface View {
// }
var View = /** @class */ (function () {
    function View(table, winner_element, winner_name_element) {
        this.table = table;
        if (winner_element == null)
            throw new Error("winner_element");
        this.winner_element = winner_element;
        if (winner_name_element == null)
            throw new Error("winner_name_element");
        this.winner_name_element = winner_name_element;
    }
    View.prototype.render_tiles = function (tiles) {
        for (var i in tiles) {
            if (!tiles[i].value)
                continue;
            this.table.tiles[i].style.background = tiles[i].value.color;
        }
    };
    View.prototype.render_winner = function (player) {
        if (player == null) {
            this.winner_element.textContent = "Draw";
            return;
        }
        this.winner_element.textContent = "Winner is ";
        this.winner_name_element.style.color = player === null || player === void 0 ? void 0 : player.color;
        this.winner_name_element.textContent = player === null || player === void 0 ? void 0 : player.name;
    };
    View.prototype.handle = function (tile_element, callback, context) {
        tile_element.addEventListener("click", function () {
            callback.call(context, tile_element);
        });
    };
    return View;
}());
function index_to_row_and_col(index) {
    return { row: Math.floor(index / 3), column: index % 3 };
}
var Controller = /** @class */ (function () {
    function Controller(view, game) {
        this.view = view;
        this.game = game;
        this.playing = true;
        for (var _i = 0, _a = this.view.table.tiles; _i < _a.length; _i++) {
            var element = _a[_i];
            this.view.handle(element, this.tile_action, this);
        }
    }
    Controller.prototype.tile_action = function (tile_element) {
        if (!this.playing)
            return;
        var row_and_col = index_to_row_and_col(parseInt(tile_element.id[tile_element.id.length - 1]) - 1);
        this.game.player_action(row_and_col.row, row_and_col.column, this.game.turn);
        var winner = this.game.win_condition();
        if (winner) {
            this.playing = false;
            this.view.render_winner(winner.value);
        }
        if (this.game.empty_tiles().length === 0) {
            this.playing = false;
            this.view.render_winner(winner);
        }
        this.view.render_tiles(this.game.board.tiles);
    };
    return Controller;
}());
// interface Tile {
//   value: null | Player;
// }
var Tile = /** @class */ (function () {
    function Tile() {
        this._value = null;
    }
    Object.defineProperty(Tile.prototype, "value", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            if (value === null)
                return;
            if (this.value !== null)
                return;
            this._value = value;
        },
        enumerable: false,
        configurable: true
    });
    return Tile;
}());
// class PlayerArray {
//   players: Player[];
//   constructor(players: Player[]) {
//     this.players = players;
//   }
//   next(): Player {
//   }
// }
var Board = /** @class */ (function () {
    function Board(tiles) {
        this.tiles = tiles;
    }
    Board.prototype.get_row = function (row) {
        var first_index = row * 3;
        return [this.tiles[first_index], this.tiles[first_index + 1], this.tiles[first_index + 2]];
    };
    Board.prototype.get_column = function (column) {
        var first_index = column;
        return [this.tiles[first_index], this.tiles[first_index + 3], this.tiles[first_index + 6]];
    };
    Board.prototype.get_diagonal = function (direction) {
        if (direction === "on_origin") {
            return [this.tiles[0], this.tiles[4], this.tiles[8]];
        }
        else {
            return [this.tiles[2], this.tiles[4], this.tiles[6]];
        }
    };
    Board.prototype.get_tile = function (row, column) {
        var index = (row * 3) + column;
        return this.tiles[index];
    };
    return Board;
}());
function all_same(arr) {
    return arr.reduce(function (p, c) {
        if (p === null)
            return p;
        if (p.value === null)
            return null;
        return p.value != c.value ? null : c;
    });
}
var TicTacToe_Game_Model = /** @class */ (function () {
    function TicTacToe_Game_Model(players, board) {
        this.players = players;
        this.board = board;
        this.turn = this.players[0];
    }
    TicTacToe_Game_Model.prototype.next_turn = function () {
        var index = this.players.indexOf(this.turn);
        if (index === this.players.length - 1)
            return this.players[0];
        return this.players[index + 1];
    };
    TicTacToe_Game_Model.prototype.player_action = function (row, column, turn) {
        if (turn != this.turn)
            return;
        var tile = this.board.get_tile(row, column);
        if (tile.value !== null)
            return;
        tile.value = turn;
        this.turn = this.next_turn();
    };
    TicTacToe_Game_Model.prototype.win_condition = function () {
        for (var i = 0; i < 3; i += 1) {
            var winner = all_same(this.board.get_row(i));
            if (winner)
                return winner;
        }
        for (var i = 0; i < 3; i += 1) {
            var winner = all_same(this.board.get_column(i));
            if (winner)
                return winner;
        }
        {
            var winner = all_same(this.board.get_diagonal("on_origin"));
            if (winner)
                return winner;
        }
        {
            var winner = all_same(this.board.get_diagonal("alt"));
            if (winner)
                return winner;
        }
        return null;
    };
    TicTacToe_Game_Model.prototype.empty_tiles = function () {
        return this.board.tiles.filter(function (e) { return e.value == null; });
    };
    return TicTacToe_Game_Model;
}());
var table = new Table_HTML(document.querySelector(".board"), document.querySelectorAll(".tile"));
var players = [{ name: "booba", color: "#00ff00" }, { name: "awooga", color: "#0000ff" }];
var tiles = [
    new Tile(), new Tile(), new Tile(),
    new Tile(), new Tile(), new Tile(),
    new Tile(), new Tile(), new Tile()
];
var board = new Board(tiles);
var view = new View(table, document.querySelector(".winner"), document.querySelector(".name"));
var game = new TicTacToe_Game_Model(players, board);
var controller = new Controller(view, game);
