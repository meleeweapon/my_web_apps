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
    if (neighbour_count < 2) return 'dead';
    if (neighbour_count < 4) return 'alive';
    return 'dead';
  } else {
    if (neighbour_count == 3) return 'alive';
  }
}

function count_neighbours(map, x, y) {
  let count = 0
  let neighbours = [
    map[x-1][y+1], map[x][y+1], map[x+1][y+1],
    map[x-1][y]               , map[x+1][y],
    map[x-1][y-1], map[x][y-1], map[x+1][y-1]
  ]
  console.log(neighbours)
  neighbours.forEach(cell => {
    if (cell == 'alive') count += 1;
  });
  
  return count;
}

function render_map(canvas, canvas_context, map) {
  canvas_context.fillStyle = 'white'
  canvas_context.fillRect(0, 0, canvas.width, canvas.height)
  canvas_context.fillStyle = 'blue'
  let cols = map.length
  let rows = map[0].length
  let box_size_x = canvas.width / cols
  let box_size_y = canvas.height / rows

  for (let x = 0; x < cols; x += 1) {
    for (let y = 0; y < rows; y += 1) {
      if (map[x][y] == 'alive') {
        canvas_context.fillRect(
          box_size_x * x,
          box_size_y * y,
          box_size_x,
          box_size_y
        )
      }
    }
  }
}


let the_map = [
  ['alive', 'dead', 'alive'],
  ['dead', 'alive', 'dead'],
  ['alive', 'dead', 'alive']
];


let c = document.querySelector('#the-canvas')
let ctx = c.getContext('2d')
ctx.fillStyle = 'blue'

render_map(c, ctx, the_map)


// export {};