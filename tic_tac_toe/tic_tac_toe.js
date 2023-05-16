var buttons = document.querySelectorAll(".ttt-main > div");
var turn = "first_player";
var buttons_matrix = [];
for (var row = 0; row < 3; row++) {
    buttons_matrix.push([]);
    for (var col = row * 3; col < row * 3 + 3; col++) {
        buttons_matrix[row].push(buttons[col]);
    }
}
;
var event_listeners = [];
var _loop_1 = function (elem) {
    event_listeners.push(function (e) {
        var _a;
        if (turn == "first_player") {
            elem.style.background = "green";
            turn = "second_player";
        }
        else {
            elem.style.background = "blue";
            turn = "first_player";
        }
        ;
        var win_cond = check_win_condition(buttons_matrix);
        console.log(win_cond);
        if (win_cond) {
            var chl = document.createElement("div");
            chl.textContent = "Game over.";
            chl.style.fontSize = "72px";
            (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.appendChild(chl);
            for (var i = 0; i < buttons.length; i++)
                buttons[i].removeEventListener("click", event_listeners[i]);
        }
    });
};
for (var _i = 0, buttons_1 = buttons; _i < buttons_1.length; _i++) {
    var elem = buttons_1[_i];
    _loop_1(elem);
}
;
for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", event_listeners[i]);
}
;
function all_same(iterable) {
    var first = iterable[0];
    if (first === "")
        return false;
    for (var _i = 0, iterable_1 = iterable; _i < iterable_1.length; _i++) {
        var item = iterable_1[_i];
        // console.log(first, item);
        if (item !== first)
            return false;
    }
    return true;
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
    for (var row = 2, col = 0; row > 0 && col < table[0].length; row--, col++)
        cross_2.push(table[row][col]);
    var is_win_2 = all_same(cross_2.map(function (elem) { return elem.style.background; }));
    if (is_win_2)
        return is_win_2;
    return false;
}
;
// for (const elem of buttons) {
//   elem.addEventListener("click", (e) => {
//     elem.
//   }); 
// }
