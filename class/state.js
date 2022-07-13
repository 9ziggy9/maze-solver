import {Grid} from './gfx.js';

// GLOBAL CONSTANTS
const FACTOR = 50;
export const CELL_SIZE = 25;
export const WIDTH = 16 * FACTOR;
export const HEIGHT = 9 * FACTOR;
export const COLS = WIDTH / CELL_SIZE;
export const ROWS = WIDTH / CELL_SIZE;

// GLOBAL STATE
export class State {
  constructor() {
    this.mode = 'boundaries';

    this.grid = new Grid();
    Grid.init(this.grid);

    this.obstacles = [];
    this.endpoints = [];
    this.path = [];
  }
  clearEndpoints() {
    this.endpoints = [];
    this.grid.cells.forEach(row => {
      row.forEach(cell => {
	if (cell.type === 2) {
	  cell.type = 0; 
	  cell.isAccessible = true;
	}
	if (cell.type === 3) {
	  cell.type = 0; 
	  cell.isAccessible = true;
	}
      });
    });
  }
  regenerate() {
    this.mode = 'boundaries';
    this.grid = new Grid();
    Grid.init(this.grid);
    this.obstacles = [];
    this.endpoints = [];
    this.path = [];
  }
}
