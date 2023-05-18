var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var buttons = __spreadArray([], document.querySelectorAll(".ttt-main > div"), true);
var turn = "first_player";
var game_state = "playing";
var winner = "none";
var buttons_matrix = [];
for (var row = 0; row < 3; row++) {
    buttons_matrix.push([]);
    for (var col = row * 3; col < row * 3 + 3; col++) {
        buttons_matrix[row].push(buttons[col]);
    }
}
;
var event_listeners = [];
function button_evlistener(elem) {
    return function (e) {
        var _a, _b;
        if (game_state === "finished") {
            return;
        }
        var bg = elem.style.background;
        if (turn == "first_player") {
            if (bg !== "") {
                return;
            }
            elem.style.background = "green";
            turn = "second_player";
        }
        else {
            if (bg !== "") {
                return;
            }
            elem.style.background = "blue";
            turn = "first_player";
        }
        ;
        var win_cond = check_win_condition(buttons_matrix);
        console.log(win_cond);
        if (win_cond) {
            var chl = document.createElement("div");
            chl.textContent = "Game over.";
            if (win_cond === "green") {
                chl.textContent += " Player 1 won.";
            }
            else {
                chl.textContent += " Player 2 won.";
            }
            chl.style.fontSize = "72px";
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.appendChild(chl);
            game_state = "finished";
            // for (let i = 0; i < buttons.length; i++) 
            //   buttons[i].removeEventListener("click", event_listeners[i]);
        }
        var draw_condition = !(buttons.some(function (e) { return (e.style.background === ""); })) && !win_cond;
        console.log(draw_condition, buttons.some(function (e) { return (e.style.background !== ""); }), !win_cond);
        if (draw_condition) {
            var chl = document.createElement("div");
            chl.textContent = "Game over. Draw";
            chl.style.fontSize = "72px";
            (_b = document.querySelector("body")) === null || _b === void 0 ? void 0 : _b.appendChild(chl);
            game_state = "finished";
        }
    };
}
for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
    var elem = buttons_1[_i];
    event_listeners.push(button_evlistener(elem));
}
;
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", event_listeners[i]);
}
;
function all_same(iterable) {
    var first = iterable[0];
    if (first === "")
        return null;
    for (var _i = 0, iterable_1 = iterable; _i < iterable_1.length; _i++) {
        var item = iterable_1[_i];
        // console.log(first, item);
        if (item !== first)
            return null;
    }
    return first;
}
function check_win_condition(table) {
    // check rows
    for (var _i = 0, table_1 = table; _i < table_1.length; _i++) {
        var row = table_1[_i];
        var is_win_1 = all_same(row.map(function (elem) { return elem.style.background; }));
        if (is_win_1)
            return is_win_1;
    }
    // check columns
    for (var col = 0; col < table.length; col++) {
        var column = [];
        for (var row = 0; row < 3; row++)
            column.push(table[row][col]);
        var is_win_3 = all_same(column.map(function (elem) { return elem.style.background; }));
        if (is_win_3)
            return is_win_3;
    }
    // check crosses
    var cross = [];
    for (var row = 0, col = 0; row < table.length && col < table[0].length; row++, col++)
        cross.push(table[row][col]);
    var is_win = all_same(cross.map(function (elem) { return elem.style.background; }));
    if (is_win)
        return is_win;
    var cross_2 = [];
    for (var row = 2, col = 0; row >= 0 && col < table[0].length; row--, col++)
        cross_2.push(table[row][col]);
    var is_win_2 = all_same(cross_2.map(function (elem) { return elem.style.background; }));
    if (is_win_2)
        return is_win_2;
    return null;
}
;
// for (const elem of buttons) {
//   elem.addEventListener("click", (e) => {
//     elem.
//   }); 
// }
