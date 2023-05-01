// current_cell = 'dead' | 'alive';
// neighbour_count = ...; // 0...8
// next_cell = undefined;
// switch (current_cell) {
//   case 'dead': {
//   } break;
//   case 'alive': {
//   } break;
// }
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
function count_neighbours(map, x, y) {
    var count = 0;
    var neighbours = [
        map[x - 1][y + 1], map[x][y + 1], map[x + 1][y + 1],
        map[x - 1][y], map[x + 1][y],
        map[x - 1][y - 1], map[x][y - 1], map[x + 1][y - 1]
    ];
    console.log(neighbours);
    neighbours.forEach(function (cell) {
        if (cell == 'alive')
            count += 1;
    });
    return count;
}
function render_map(canvas, canvas_context, map) {
    canvas_context.fillStyle = 'white';
    canvas_context.fillRect(0, 0, canvas.width, canvas.height);
    canvas_context.fillStyle = 'blue';
    var cols = map.length;
    var rows = map[0].length;
    var box_size_x = canvas.width / cols;
    var box_size_y = canvas.height / rows;
    for (var x = 0; x < cols; x += 1) {
        for (var y = 0; y < rows; y += 1) {
            if (map[x][y] == 'alive') {
                canvas_context.fillRect(box_size_x * x, box_size_y * y, box_size_x, box_size_y);
            }
        }
    }
}
var the_map = [
    ['alive', 'dead', 'alive'],
    ['dead', 'alive', 'dead'],
    ['alive', 'dead', 'alive']
];
var c = document.querySelector('#the-canvas');
var ctx = c.getContext('2d');
ctx.fillStyle = 'blue';
render_map(c, ctx, the_map);
// export {};
