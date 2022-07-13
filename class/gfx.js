import {ROWS, COLS, CELL_SIZE} from './state.js';
import {mouse,ctx,canvas} from '../main.js';

export class Grid {
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
