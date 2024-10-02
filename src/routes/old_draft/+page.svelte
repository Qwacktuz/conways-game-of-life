<script>
	let columns = 63;
	let rows = 25;
	let running = false;
	let speed = 1000; // in milliseconds
	let generation = 0;
	let generationJump;

	// Create an empty row array with 'columns' number of cells all set to 'false'. This is used to initialize the grid array.
	let grid = Array(rows)
		.fill()
		.map(() => Array(columns).fill(false));
	// Alternative method:
	// let emptyRow = Array(columns).fill(false);
	// let grid = Array(rows).fill(emptyRow);

	const toggleCell = (row, column) => {
		grid[row][column] = !grid[row][column];
		grid = [...grid];
	};

	const countNeighbors = (grid, currentCellX, currentCellY) => {
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
			const newX = currentCellX + dx;
			const newY = currentCellY + dy;

			// Check if the new coordinates are within the grid bounds and if the cell is alive.
			// It checks if newX and newY are between 0 and our 'rows' variable or 0 and 'columns' variable
			// The last condition checks if the cell is alive: grid[newX][newY]
			if (newX >= 0 && newX < rows && newY >= 0 && newY < columns && grid[newX][newY]) {
				return acc + 1; // Increment the count if the cell is alive.
			}

			return acc; // Return the current count if the cell is not alive.
		}, 0); // Initial value of the accumulator is 0
	};

	const updateGrid = () => {
		// Create a new grid by mapping over each cell in the current grid.
		let newGrid = grid.map((row, x) =>
			row.map((cell, y) => {
				// Count the number of neighbors for the current cell.
				const neighbors = countNeighbors(grid, x, y);

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

		// Update the grid with the new state.

		// Check if the grid has changed.
		// let gridChanged = grid.some((row, x) => row.some((cell, y) => cell !== newGrid[x][y]));

		// if (gridChanged) {
		grid = newGrid;
		generation++;
		// }
	};

	// Sleep isn't built into JS apparently, thank you StackOverflow
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

	const startGame = async () => {
		if (!running) {
			running = true;
			while (running) {
				updateGrid();
				await sleep(speed);
			}
			console.log('Game started');
		}
	};

	const stopGame = () => {
		if (running) {
			running = false;
			console.log('Game stopped');
		}
	};

	const nextGeneration = () => {
		if (!running) {
			updateGrid();
		}
	};

	const jumpToGeneration = (generationJump) => {
		for (let i = 0; i < generationJump; i++) {
			updateGrid();
		}
	};

	const clearGrid = () => {
		grid = Array(rows)
			.fill()
			.map(() => Array(columns).fill(false));
		generation = 0;
		console.log('Grid cleared, generations cleared');
	};
</script>

<main>
	{#if running || generation > 0}
		<h2>Current generation: {generation}</h2>
		<h2>
			Speed: {speed >= 1000
				? (speed / 1000).toFixed(1) + ' seconds'
				: speed.toFixed(1) + ' milliseconds'}
		</h2>
	{:else}
		<h2>Click on the grid to toggle cells</h2>
	{/if}
	<div
		class="grid"
		style="grid-template-columns: repeat({columns}, 30px); grid-template-rows: repeat({rows}, 30px);"
	>
		{#each grid as row, rowIndex}
			{#each row as cell, columIndex}
				<div
					class="cell {cell ? 'alive' : ''}"
					on:click={() => toggleCell(rowIndex, columIndex)}
				></div>
			{/each}
		{/each}
	</div>

	<div>
		<label for="speed">Speed (ms): </label>
		<input type="range" min="1" max="5000" step="100" bind:value={speed} id="speed" />
		<label for="generation">Increment a number of generations: </label>
		<input type="number" id="generation" bind:value={generationJump} min="0" />
		<button on:click={() => jumpToGeneration(generationJump)}>Go</button>
	</div>

	<div class="controls">
		<button on:click={startGame}>Start</button>
		<button on:click={stopGame}>Stop</button>
		<button on:click={clearGrid}>Clear grid and generations</button>
		<button on:click={nextGeneration}>Next Generation</button>
	</div>
</main>

<style>
	.grid {
		display: grid;
		/* grid-template-columns: repeat({columns}, 20px);
		grid-template-rows: repeat({rows}, 20px); */
	}
	.cell {
		width: 30px;
		height: 30px;
		border: 1px solid #ddd;
	}
	.alive {
		background-color: black;
	}
	.controls {
		margin-top: 20px;
	}
	button {
		margin-right: 10px;
	}
</style>
