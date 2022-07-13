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
    this.mode = 'obstacles';

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
    this.cells = [];
  }
  static init(grid) {
    for (let y = 0; y < HEIGHT; y += CELL_SIZE) {
      for (let x = 0;  x < WIDTH; x += CELL_SIZE) {
	grid.cells.push(new Cell(x,y));
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
  draw() {
    if (mouse.x && mouse.y && Cell.collision(this, mouse)) {
      ctx.strokeStyle = 'green';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
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

// INIT
const state = new State();
console.log(state.grid.cells);

// HANDLING
const handleGrid = () => state.grid.cells.forEach(cell => cell.draw());

function run() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleGrid();
  requestAnimationFrame(run);
}

// READY, SET, GO!
run();
