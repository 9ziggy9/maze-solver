import {Grid} from './gfx.js';

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
  flood() { // <--- JUST BFS WITHOUT PATH RECONSTRUCTION; its a flood fill
    const [start, end] = this.endpoints;
    let queue = [];
    queue.push(start);
    // let previous = null;
    while (queue.length > 0) {
      const current = queue.shift();
      current.type = 4;
      // current.through = previous;
      // previous = current;
      if (current === end) {
	console.log(`DISCOVERED CELL @ {${current.ix}, ${current.iy}}`);
	return 1;
      }
      current.neighborDirs.forEach(dir => {
	const {dx,dy} = dir;
	const {ix, iy} = current;
	const neighbor = this.grid.cells[iy+dy][ix+dx];
	if (neighbor.isQueued === false && neighbor.type !== 1) {
	  neighbor.isQueued = true;
	  queue.push(neighbor); 
	}
      });
    }
    return 0;
  }
  djikstra() {
    const [start, end] = this.endpoints;
    let queue = [];
    // let history = [];
    start.isQueued = true;
    queue.push(start);
    // history.push({ix: start.ix, iy: start.iy, parent: null});
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === end) {
	console.log(`DISCOVERED CELL @ {${current.ix}, ${current.iy}}`);
	this.reconstructPath(current).forEach(indices => {
	  const {ix, iy} = indices;
	  this.grid.cells[iy][ix].type = 4;
	});
	return 1;
      }
      current.neighborDirs.forEach(dir => {
	const {dx,dy} = dir;
	const {ix, iy} = current;
	const neighbor = this.grid.cells[iy+dy][ix+dx];
	if (neighbor.isQueued === false && neighbor.type !== 1) {
	  neighbor.isQueued = true;
	  // history.push({ix: neighbor.ix, iy: neighbor.iy,
	  // 		parent: {ix: current.ix, iy: current.iy}});
	  neighbor.parent = current;
	  queue.push(neighbor); 
	}
      });
    }
    return 0;
  }
  reconstructPath(cell) { // <-- could also use recursion, how?
    const path = [];
    let current = cell;
    while (current !== null) {
      path.push({ix: current.ix, iy: current.iy});
      current = current.parent;
    }
    return path;
  }
}
