// RIP vanilla javascript...
import { writable } from 'svelte/store';

class GameOfLife {
	constructor(rows, columns, speed) {
		this.rows = rows;
		this.columns = columns;
		this.speed = speed;
		this.running = false;
		this.generation = 0;
		this.seed = '';
		this.grid = this.createEmptyGrid();

		// Making a svelte store so the grid can be updated in real time
		// Can add more variables to the store that can be exposed to the component
		this._store = writable({ grid: this.grid, generation: this.generation });
	}

	// Create an empty row array with 'columns' number of cells all set to 'false'. This is used to initialize the grid array.
	createEmptyGrid() {
		return Array(this.rows)
			.fill()
			.map(() => Array(this.columns).fill(false));
		// Alternative method:
		// let emptyRow = Array(columns).fill(false);
		// let grid = Array(rows).fill(emptyRow);
	}

	// Svelte store stuff
	subscribe(subscriber) {
		return this._store.subscribe(subscriber);
	}

	toggleCell(row, column) {
		this.grid[row][column] = !this.grid[row][column];
		this.grid = [...this.grid];
		this._store.update((n) => ({ ...n, grid: this.grid }));
	}

	// Count the neighbours of a given cell (x, y) in a grid
	countNeighbors(grid, x, y) {
		// Define the possible directions to check for neighbors.
		const directions = [
			[-1, -1], // Top left
			[-1, 0], // Top middle
			[-1, 1], // Top right
			[0, -1], // Left middle
			[0, 1], // Right middle
			[1, -1], // Bottom left
			[1, 0], // Bottom middle
			[1, 1] // Bottom right
		];

		// Iterate over the directions and count the neighbors.
		return directions.reduce((acc, [dx, dy]) => {
			// Calculate the new/actual coordinates for each neighboring cell.
			const newX = x + dx;
			const newY = y + dy;

			// Check if the new coordinates are within the grid bounds and if the cell is alive.
			// It checks if newX and newY are between 0 and our 'rows' variable or 0 and 'columns' variable
			// The last condition checks if the cell is alive: grid[newX][newY]
			if (newX >= 0 && newX < this.rows && newY >= 0 && newY < this.columns && grid[newX][newY]) {
				return acc + 1; // Increment the count if the cell is alive.
			}
			return acc; // Return the current count if the cell is not alive.
		}, 0); // Initial value of the accumulator is 0
	}

	updateGrid(grid) {
		// Create a new grid by mapping over each cell in the current grid.
		let newGrid = grid.map((row, x) =>
			row.map((cell, y) => {
				// Count the number of neighbors for the current cell.
				const neighbors = this.countNeighbors(grid, x, y);

				// Apply the rules of the game to determine the next state of the cell.
				// if the cell is alive and has less than 2 or more than 3 neighbors
				if (cell && (neighbors < 2 || neighbors > 3)) {
					return false; // Cell dies due to under- or over-population.
				}
				if (!cell && neighbors === 3) {
					return true; // Cell is born due to reproduction.
				}
				return cell; // Cell remains in its current state.
			})
		);
		this.generation++;

		// Svelte reacitvity with stores, .update(n=>{}) can be used aswell
		this._store.update((n) => ({ ...n, grid: newGrid, generation: this.generation }));

		// Previous more ugly version:
		// this._store.set({
		// 	grid: newGrid,
		// 	generation: this.generation
		// });

		this.grid = newGrid;

		// Debug stuff
		// console.log(`Generation: ${this.generation}`);
	}

	// Sleep isn't built into JS apparently, thank you StackOverflow
	sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async start() {
		if (!this.running) {
			this.running = true;
			while (this.running) {
				this.updateGrid(this.grid);
				await this.sleep(this.speed);
			}
		}
	}

	stop() {
		this.running = false;
	}

	nextGeneration() {
		if (!this.running) {
			this.updateGrid(this.grid);
		}
	}

	incrementGenerations(increment) {
		for (let i = 0; i < increment; i++) {
			this.updateGrid(this.grid);
		}
	}

	clearGrid() {
		this.grid = Array(this.rows)
			.fill()
			.map(() => Array(this.columns).fill(false));
		this.generation = 0;
		this._store.update((n) => ({ ...n, grid: this.grid, generation: this.generation }));
	}

	loadSeed(seedObject) {
		const { cols, rows, cells } = seedObject;
		this.rows = rows;
		this.cols = cols;
		this.grid = this.createEmptyGrid();

		cells.forEach((cell) => {
			this.grid[cell.y][cell.x] = true;
		});

		// Update the store so svelte reactivity kicks in
		this._store.update((n) => ({ ...n, grid: this.grid, generation: this.generation }));
	}

	loadSeedString(seedString) {
		// const { cols, rows, cells } = seedString;
		const decodedSeedString = atob(seedString);

		const seedObject = JSON.parse(decodedSeedString);

		const { cols, rows, cells } = seedObject;
		this.rows = rows;
		this.cols = cols;
		this.grid = this.createEmptyGrid();

		cells.forEach((cell) => {
			this.grid[cell.y][cell.x] = true;
		});

		// Update the store so svelte reactivity kicks in
		this._store.update((n) => ({ ...n, grid: this.grid, generation: this.generation }));
	}

	generateSeedString(grid) {
		const rows = grid.length;
		const cols = grid[0].length;
		const cells = [];

		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (grid[y][x] === true) {
					cells.push({ x: x, y: y });
				}
			}
		}

		// The game seed in JSON format
		// const gameSeed = JSON.stringify({ cols: cols, rows: rows, cells: cells });

		// Create a string representation: "cols,rows,x1,y1,x2,y2,..."
		const seedString = JSON.stringify({ cols: cols, rows: rows, cells: cells });
		// const seedString = [cols, rows, ...cells.map((c) => c.x + ',' + c.y)].join(',');
		console.log(seedString);

		// Encode the seed string in Base64
		const encodedSeed = btoa(seedString);

		return encodedSeed;
	}
}

export default GameOfLife;
