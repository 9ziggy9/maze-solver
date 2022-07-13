import {Grid} from './gfx.js';

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
