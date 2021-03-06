import {State} from './class/state.js';
import {ctx, canvas, canvasPosition, mouse, CELL_SIZE} from './class/gfx.js';

// LISTENERS
canvas.addEventListener('mousemove', e => {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', e => {
  mouse.x = undefined;
  mouse.y = undefined;
});
canvas.addEventListener('click', e => {
  const x = (mouse.x - (mouse.x % CELL_SIZE)) / CELL_SIZE;
  const y = (mouse.y - (mouse.y % CELL_SIZE)) / CELL_SIZE;
  const clicked = state.grid.cells[y][x];
  switch (state.mode) {
  // types: 0 -> accessible, 1 -> boundary, 2 -> start, 3 -> end, 4 -> path
  case 'boundaries':
    clicked.type = clicked.type === 1 ? 0 : 1;
    break;
  case 'set-start':
    state.clearEndpoints();
    if (clicked.type === 0 && !state.endpoints.length) {
      clicked.type = 2;
      state.endpoints.push(clicked);
      state.mode = 'set-end';
    }
    break;
  case 'set-end':
    if (clicked.type === 0 && state.endpoints.length === 1) {
      clicked.type = 3;
      state.endpoints.push(clicked);
      state.mode = 'set-start';
    }
    break;
  default:
    break;
  }
});
window.addEventListener('keypress', e => {
  console.log(e.code);
  switch (e.code) {
  case "Space":
    state.clearEndpoints();
    if (state.mode === "boundaries") {
      state.mode = "set-start"; 
    }
    else state.mode = "boundaries";
    break;
  case "KeyQ":
    state.regenerate();
    break;
  case "KeyF":
    state.mode = "flood";
    state.flood();
    state.mode = "boundaries";
    break;
  case "Enter":
    state.mode = "djikstra";
    console.log("RUNNING DJIKSTRA");
    state.djikstra();
    state.mode = "boundaries";
    break;
  case "KeyA":
    state.mode = "astar";
    console.log("RUNNING ASTAR");
    state.astar();
    state.mode = "boundaries";
    break;
  case "KeyL":
    state.mode = "aflood";
    console.log("RUNNING ASTAR FLOOD");
    state.aflood();
    state.mode = "boundaries";
    break;
  default:
    break;
  }
});

// INIT
const state = new State();

// HANDLING
const handleHighlight = () => state.grid.cells.forEach(row => {
  row.forEach(cell => cell.highlight());
});
const handleGrid = () => state.grid.cells.forEach(row => {
  row.forEach(cell => cell.draw());
});

function run() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleGrid();
  handleHighlight();
  requestAnimationFrame(run);
}

// READY, SET, GO!
run();
