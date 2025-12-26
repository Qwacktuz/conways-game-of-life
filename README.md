# 🧬 Conway's Game of Life

An simple interactive implementation of Conway's Game of Life built with **Svelte** and **SvelteKit**.

[LIVE DEMO](https://qwacktuz.github.io/conways-game-of-life/)

---

## ✨ Features

- **Interactive Grid**: Draw cells directly on the board while the simulation is paused.
- **Seed Generation**: Export and import patterns or specific structures (random seen generation coming soon™️)
- **Static Deployment**: Fully automated CI/CD pipeline via GitHub Actions.

## 🚀 Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/)
- **State Management**: Svelte Stores
- **Package Manager**: [pnpm](https://pnpm.io/)
- **Deployment**: GitHub Pages (Static Adapter)

---

## 🕹️ The Rules

The Game of Life is a zero-player game, meaning its evolution is determined by its initial state.

1. **Birth**: Any dead cell with exactly three live neighbors becomes a live cell.
2. **Survival**: Any live cell with two or three live neighbors lives on to the next generation.
3. **Death**: All other live cells die in the next generation (underpopulation or overpopulation).

---

## 🛠️ Development

### Installation

```bash
# Clone the repository
git clone https://github.com/Qwacktuz/conways-game-of-life.git

# Install dependencies
pnpm install

# Run the development server
pnpm run dev --open
```
