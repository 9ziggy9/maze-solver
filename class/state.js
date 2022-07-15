import {Grid, Cell} from './gfx.js';

// GLOBAL STATE
export class State {
  constructor() {
    this.mode = 'boundaries';

    this.grid = new Grid();
    Grid.init(this.grid);

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
  flood() {
    const [start, end] = this.endpoints;
    let queue = [];
    queue.push(start);
    while (queue.length > 0) {
      const current = queue.shift();
      current.type = 4;
      if (current === end) {
	console.log(`DISCOVERED CELL @ {${current.ix}, ${current.iy}}`);
	return 0; // <--- SUCCESS
      }
      current.neighborDirs.forEach(dir => {
	const {dx, dy} = dir;
	const {ix, iy} = current;
	const neighbor = this.grid.cells[iy+dy][ix+dx];
	if (neighbor.isQueued === false && neighbor.type !== 1) {
	  neighbor.isQueued = true;
	  queue.push(neighbor);
	}
      });
    }
    return 1; // <-- FAILURE
  }
  djikstra() {
    const [start, end] = this.endpoints;
    let queue = [];
    start.isQueued = true;
    queue.push(start);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === end) {
	console.log(`DISCOVERED CELL @ {${current.ix}, ${current.iy}}`);
	this.reconstructPath(current).forEach(indices => {
	  const {ix, iy} = indices;
	  this.grid.cells[iy][ix].type = 4;
	});
	return 0; // <--- SUCCESS
      }
      current.neighborDirs.forEach(dir => {
	const {dx, dy} = dir;
	const {ix, iy} = current;
	const neighbor = this.grid.cells[iy+dy][ix+dx];
	if (neighbor.isQueued === false && neighbor.type !== 1) {
	  neighbor.isQueued = true;
	  neighbor.parent = current;
	  queue.push(neighbor);
	}
      });
    }
    return 1; // <-- FAILURE
  }
  astar() {
    const [start, end] = this.endpoints;
    let queue = [];
    start.isQueued = true;
    queue.push(start);
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === end) {
	console.log(`DISCOVERED CELL @ {${current.ix}, ${current.iy}}`);
	this.reconstructPath(current).forEach(indices => {
	  const {ix, iy} = indices;
	  this.grid.cells[iy][ix].type = 4;
	});
	return 0; // <--- SUCCESS
      }
      current.neighborDirs.forEach(dir => {
	const {dx, dy} = dir;
	const {ix, iy} = current;
	const neighbor = this.grid.cells[iy+dy][ix+dx];
	if (neighbor.isQueued === false && neighbor.type !== 1) {
	  neighbor.isQueued = true;
	  neighbor.parent = current;
	  neighbor.distance = Cell.euclideanD(neighbor, end);
	  queue.push(neighbor);
	}
      });
      queue.sort((a,b) => a.distance - b.distance);
    }
    return 1; // <-- FAILURE
  }
  reconstructPath(cell) {
    const path = [];
    let current = cell;
    while (current !== null) {
      path.push({ix: current.ix, iy: current.iy});
      current = current.parent;
    }
    return path;
  }
}
