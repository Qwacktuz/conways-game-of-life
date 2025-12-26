<script>
	import Modal from '$lib/components/SeedGenerationModal.svelte';
	import gameSeed from '$lib/game_seed_structure.json';

	import GameOfLife from '$lib/game_of_life.js';
	import SeedGenerationModal from '$lib/components/SeedGenerationModal.svelte';

	const GAME_SETTINGS = {
		columns: 60,
		rows: 30,
		speed: 1000, // in milliseconds (ms)
		cellSize: 30, // in pixels (px)
		seed: ''
	};

	let { columns, rows, speed, cellSize, seed } = GAME_SETTINGS;
	const game = new GameOfLife(rows, columns, speed);

	$: {
		// debug the game store
		console.log($game);
	}

	let generationIncrement = 0;
	let showModal = false;
</script>

<main>
	{#if $game.grid || $game.generation > 0}
		<h2>Current generation: {$game.generation}</h2>
		<h2>
			Speed: {game.speed >= 1000
				? (game.speed / 1000).toFixed(1) + ' seconds'
				: game.speed.toFixed(1) + ' milliseconds'}
		</h2>
		<h2>Columns: {columns}, Rows: {rows}</h2>
	{:else}
		<h2>Click on the grid to toggle cells</h2>
	{/if}
	<div
		class="grid"
		style="grid-template-columns: repeat({columns}, {cellSize}px); grid-template-rows: repeat({rows}, {cellSize}px);"
	>
		{#each $game.grid as row, rowIndex}
			{#each row as cell, columnIndex}
				<div
					class="cell {cell ? 'alive' : ''}"
					on:click={() => {
						game.toggleCell(rowIndex, columnIndex);
						// This line is usually needed, but we are using svelte stores
						// game.grid = game.grid;
					}}
				></div>
			{/each}
		{/each}
	</div>

	<div class="settings">
		<div class="game-controls">
			<label for="speed">Speed (ms): </label>
			<input type="range" min="0.1" max="1000" step="100" bind:value={game.speed} id="speed" />
			<label for="generation">Increment a number of generations: </label>
			<input type="number" id="generation" bind:value={generationIncrement} min="0" />
			<button on:click={() => game.incrementGenerations(generationIncrement)}>Go</button>

			<label for="seedInput">Enter game seed: </label>
			<input type="text" bind:value={seed} id="seedInput" />
			<button on:click={() => game.loadSeedString(seed)}>Load game seed</button>
		</div>

		<div class="game-buttons">
			<button on:click={() => game.start()}>Start</button>
			<button on:click={() => game.stop()}>Stop</button>
			<button on:click={() => game.clearGrid()}>Clear grid and generations</button>
			<button on:click={() => game.nextGeneration()}>Next Generation</button>
			<button on:click={() => (showModal = true)}>Create a game seed</button>
		</div>
	</div>

	<SeedGenerationModal bind:showModal>
		<h2>Game seed generated:</h2>
		<code>{game.generateSeedString($game.grid)}</code>
	</SeedGenerationModal>
</main>

<style>
	main {
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		background-color: #2c2c2c; /* Slightly lighter dark background for contrast */
		padding: 20px;
		border-radius: 10px;
		box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7); /* Darker shadow for depth */
		width: 100%;
	}

	h2 {
		margin-bottom: 10px;
		color: #bbbbbb; /* Softer light grey for headers */
	}

	/* Grid styling */
	.grid {
		display: grid;
		gap: 2px;
		border: 2px solid #444444; /* Darker border */
		background-color: #2a2a2a; /* Darker background for the grid */
		margin-bottom: 20px;
	}

	.cell {
		width: 100%;
		height: 100%;
		background-color: #444444; /* Dark gray for dead cells */
		border-radius: 3px;
		cursor: pointer;
		transition: background-color 0.2s ease-in-out;
	}

	.alive {
		background-color: #ff6b6b; /* Vibrant red color for alive cells */
	}

	code {
		background-color: #333; /* Darker background for code blocks */
		color: #e0e0e0; /* Light text in code blocks */
		word-break: break-all;
	}

	.settings {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20px;
	}

	div > * {
		margin-bottom: 10px;
	}

	.game-controls,
	.game-buttons {
		margin-bottom: 20px;
	}

	label {
		font-weight: bold;
	}

	button {
		background-color: #212427; /* Light blue buttons */
		border: none;
		color: white;
		padding: 10px 20px;
		font-size: 16px;
		border-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #3072b3; /* Slightly darker blue on hover */
	}

	input[type='range'],
	input[type='number'],
	input[type='text'] {
		background-color: #333; /* Darker background for inputs */
		color: #e0e0e0; /* Light text in inputs */
		border: 1px solid #555;
		border-radius: 5px;
		padding: 5px;
		width: 100%;
	}

	input[type='range'] {
		cursor: pointer;
	}

	/* Responsive styling */
	@media (max-width: 768px) {
		main {
			padding: 15px;
		}

		.grid {
			grid-template-columns: repeat(25, minmax(20px, 1fr)); /* Adjust grid for smaller screens */
			grid-template-rows: repeat(25, minmax(20px, 1fr));
		}
	}
</style>
