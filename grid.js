const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

// GLOBAL CONSTANTS
const FACTOR = 50;
const CELL_SIZE = 25;
const WIDTH = 16 * FACTOR;
const HEIGHT = 9 * FACTOR;
const COLS = WIDTH / CELL_SIZE;
const ROWS = WIDTH / CELL_SIZE;
// Initialize canvas dimensions
canvas.width = WIDTH;
canvas.height = HEIGHT;

// GLOBAL STATE
class State {
  constructor() {
    this.mode = 'boundaries';

    this.grid = new Grid();
    Grid.init(this.grid);

    this.obstacles = [];
    this.endpoints = [];
    this.path = [];
  }
}

// CLASSES
class Grid {
  constructor() {
    this.cells = new Array(ROWS);
    for (let y = 0; y < ROWS; y++) this.cells[y] = new Array(COLS);
  }
  static init(grid) {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0;  x < COLS; x++) {
	grid.cells[y][x] = new Cell(CELL_SIZE*x,CELL_SIZE*y);
      }
    }
  }
}

class Cell {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;
    this.isAccessible = true;
    // 0 -> accessible, 1 -> boundary, 2 -> start, 3 -> end, 4 -> path
    this.type = 0; 
  }
  static collision(first, second) {
    if (!(first.x > second.x + second.width
	|| first.x + first.width < second.x
	|| first.y > second.y + second.height
	|| first.y + first.height < second.y)) {
      return true;
    }
    return false;
  }
  highlight() {
    if (mouse.x && mouse.y && Cell.collision(this, mouse)) {
      ctx.strokeStyle = 'green';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
  }
  draw() {
    switch(this.type) {
    case 0:
      ctx.fillStyle = '#999999'; // light gray
      break;
    case 1:
      ctx.fillStyle = '#333333'; // charcoal
      break;
    case 2:
      ctx.fillStyle = 'blue';
      break;
    case 3:
      ctx.fillStyle = 'red';
      break;
    case 4:
      ctx.fillStyle = 'green';
      break;
    default:
      break;
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// INTERFACE
const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
};

// NEED COORDINATES OF CANVAS TO COMPUTE MOUSE POSITION
let canvasPosition = canvas.getBoundingClientRect();

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
  console.log(x,y);
  switch(state.mode) {
  // types: 0 -> accessible, 1 -> boundary, 2 -> start, 3 -> end, 4 -> path
  case 'boundaries':
    state.grid.cells[y][x].isAccessible = false;
    state.grid.cells[y][x].type = 1;
    console.log(state.grid.cells[y][x]);
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
  handleHighlight();
  handleGrid();
  requestAnimationFrame(run);
}

// READY, SET, GO!
run();
