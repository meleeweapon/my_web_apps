// const S = 2;
// const GoL = {
//   'dead': {
//     '3': 'alive',
//     'else': 'dead',
//   },
//   'alive': {
//     '2': 'alive',
//     '3': 'alive',
//     'else': 'dead',
//   }
// }
// current_cell = 'dead' | 'alive';
// neighbour_count = ...; // 0...8
// assert(0 <= neighbour_count %% neighbour_count <= 8)
// next_cell = undefined;
// next_cell = GoL[current_cell][neighbour_count]
// _-=======================================================-_
function cell_step(cell_state, neighbour_count) {
    if (cell_state == "alive") {
        if (neighbour_count < 2)
            return 'dead';
        if (neighbour_count < 4)
            return 'alive';
        return 'dead';
    }
    else {
        if (neighbour_count == 3)
            return 'alive';
    }
}
function count_neighbours(map, col, row) {
    var count = 0;
    var neighbours = [
        map[col - 1][row + 1], map[col][row + 1], map[col + 1][row + 1],
        map[col - 1][row], map[col + 1][row],
        map[col - 1][row - 1], map[col][row - 1], map[col + 1][row - 1]
    ];
    neighbours.forEach(function (cell) {
        if (cell == 'alive')
            count += 1;
    });
    return count;
}
function map_step(map) {
    for (var col = 1; col < the_map.length - 1; col++) {
        for (var row = 1; row < the_map[0].length - 1; row++) {
            var cell_state = map[col][row];
            var neighbours = count_neighbours(map, col, row);
            map[col][row] = cell_step(cell_state, neighbours);
        }
    }
}
function render_map(canvas, canvas_context, map) {
    canvas_context.fillStyle = 'white';
    canvas_context.fillRect(0, 0, canvas.width, canvas.height);
    canvas_context.fillStyle = 'blue';
    for (var col = 0; col < map_cols; col += 1) {
        for (var row = 0; row < map_rows; row += 1) {
            if (map[col][row] == 'alive') {
                canvas_context.fillRect(cell_width * col, cell_height * row, cell_width, cell_height);
            }
        }
    }
}
var canvas_id = 'the-canvas';
var c = document.querySelector("#".concat(canvas_id));
if (c === null)
    throw new Error("couldn't find ".concat(canvas_id));
c.width = 800;
c.height = 600;
var ctx = c.getContext('2d');
if (ctx === null)
    throw new Error("2d context is null");
var row_range = document.querySelector('#map-rows');
var column_range = document.querySelector('#map-cols');
var row_range_btn = document.querySelector('#map-rows-btn');
if (row_range_btn === null)
    throw new Error("row_range_btn is null");
var column_range_btn = document.querySelector('#map-cols-btn');
if (column_range_btn === null)
    throw new Error("column_range_btn is null");
ctx.fillStyle = '#202020';
ctx.fillRect(0, 0, c.width, c.height);
var map_rows = 32;
var map_cols = 32;
var cell_width = c.width / map_cols;
var cell_height = c.height / map_rows;
var the_map = [];
for (var row = 0; row < map_rows; row++)
    the_map.push(new Array(map_cols).fill('dead'));
c.addEventListener("click", function (e) {
    console.log(e.offsetX, e.offsetY);
    var row = Math.floor(e.offsetY / cell_height);
    var col = Math.floor(e.offsetX / cell_width);
    the_map[col][row] = 'alive';
    render_map(c, ctx, the_map);
});
var interval = null;
row_range_btn.addEventListener('click', function (e) {
    if (interval === null) {
        interval = setInterval(function () {
            map_step(the_map);
            render_map(c, ctx, the_map);
        }, 50);
    }
    else {
        clearInterval(interval);
        interval = null;
    }
});
render_map(c, ctx, the_map);
// for (let i = 0; i < map_rows; i++) {
//   ctx.fillRect(i * cell_width, i * cell_height, cell_width, cell_height);
// }
// render_map(c, ctx, the_map)
// export {};
