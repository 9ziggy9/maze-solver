// GLOBAL CONSTANTS
const FACTOR = 50;
export const CELL_SIZE = 25;
export const WIDTH = 16 * FACTOR;
export const HEIGHT = 9 * FACTOR;
export const COLS = WIDTH / CELL_SIZE;
export const ROWS = HEIGHT / CELL_SIZE;

export const canvas = document.getElementById('canvas1');
export const ctx = canvas.getContext('2d');


// Initialize canvas dimensions
canvas.width = WIDTH;
canvas.height = HEIGHT;

// NEED COORDINATES OF CANVAS TO COMPUTE MOUSE POSITION
export let canvasPosition = canvas.getBoundingClientRect();

// INTERFACE
export const mouse = {
  x: undefined,
  y: undefined,
  width: 0.1,
  height: 0.1,
};

export class Grid {
  constructor() {
    this.cells = new Array(ROWS);
    for (let iy = 0; iy < ROWS; iy++) this.cells[iy] = new Array(COLS);
  }
  static init(grid) {
    for (let iy = 0; iy < ROWS; iy++) {
      for (let ix = 0;  ix < COLS; ix++) {
	grid.cells[iy][ix] = new Cell(CELL_SIZE*ix,CELL_SIZE*iy);
      }
    }
  }
};

export class Cell {
  constructor(x,y) {
    this.ix = x / CELL_SIZE;
    this.iy = y / CELL_SIZE;
    this.width = CELL_SIZE;
    this.height = CELL_SIZE;
    this.x = x;
    this.y = y;
    this.isQueued = false; // <--- Allows us to forgo using set
    this.parent = null;
    // 0 -> accessible, 1 -> boundary, 2 -> start, 3 -> end, 4 -> marked
    this.type = 0; 
    this.neighborDirs = Cell.dirs.filter(dir => {
      return dir.dx + (x / CELL_SIZE) >= 0
	  && dir.dx + (x / CELL_SIZE) < COLS
	  && dir.dy + (y / CELL_SIZE) < ROWS
	  && dir.dy + (y / CELL_SIZE) >= 0;
    });
    this.distance = null;
  }
  //                  up               down          left              right
  static dirs = [{dx: 0, dy:-1}, {dx: 0, dy: 1}, {dx: -1, dy: 0}, {dx: 1, dy: 0}];
  static euclideanD(cell, target) {
    const {x:a,y:b} = cell;
    const {x, y} = target;
    return Math.sqrt((x-a)**2 + (y-b)**2);
  }
  static manhattanD(cell, target) {
    const {x:a,y:b} = cell;
    const {x, y} = target;
    return Math.abs(x - a) + Math.abs(y - b);
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
