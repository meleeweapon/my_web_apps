// interface View {
// }
var View = /** @class */ (function () {
    function View(table) {
        this.table = table;
    }
    View.prototype.render = function (tiles) {
        for (var i in tiles) {
            if (!tiles[i].value)
                continue;
            this.table.tiles[i].style.background = tiles[i].value.color;
        }
    };
    return View;
}());
var Controller = /** @class */ (function () {
    function Controller() {
    }
    return Controller;
}());
// interface Tile {
//   value: null | Player;
// }
var Tile = /** @class */ (function () {
    function Tile() {
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
        if (p == null)
            return null;
        return p != c ? null : c;
    });
}
var TicTacToe_Game_Model = /** @class */ (function () {
    function TicTacToe_Game_Model(players, board) {
        this.players = players;
        this.board = board;
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
        tile.value = turn;
        this.turn = this.next_turn();
    };
    TicTacToe_Game_Model.prototype.win_condition = function () {
        for (var i = 0; i < 3; i += 1) {
            if (all_same(this.board.get_row(i)))
                return true;
        }
        for (var i = 0; i < 3; i += 1) {
            if (all_same(this.board.get_column(i)))
                return true;
        }
        if (all_same(this.board.get_diagonal("on_origin")))
            return true;
        if (all_same(this.board.get_diagonal("alt")))
            return true;
        return false;
    };
    TicTacToe_Game_Model.prototype.empty_tiles = function () {
        return this.board.tiles.filter(function (e) { return e.value == null; });
    };
    return TicTacToe_Game_Model;
}());
var view = new View();
var game = new TicTacToe_Game_Model();
var controller = new Controller(view, game);
