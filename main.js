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
    clicked.isAccessible = clicked.isAccessible ? false : true;
    clicked.type = clicked.type === 1 ? 0 : 1;
    break;
  case 'set-start':
    state.clearEndpoints();
    if (clicked.isAccessible && !state.endpoints.length) {
      clicked.type = 2;
      clicked.isAccessible = false;
      state.endpoints.push(clicked);
      state.mode = 'set-end';
    }
    break;
  case 'set-end':
    if (clicked.isAccessible && state.endpoints.length === 1) {
      clicked.type = 3;
      clicked.isAccessible = false;
      state.endpoints.push(clicked);
      state.mode = 'set-start';
    }
    break;
  default:
    break;
  }
});
window.addEventListener('keypress', e => {
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
  case "Enter":
    state.mode = "run";
    const [start, end] = state.endpoints;
    state.grid.bfs(start, end);
    state.mode = "boundaries";
    break;
  default:
    break;
  }
});

// INIT
const state = new State();
console.log(state.grid.cells);

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
