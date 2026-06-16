# ⭕ Tic Tac Toe — Space Plasma Edition

A polished, fully-featured Tic Tac Toe game built with **React + Vite**. Supports two-player local play and a single-player mode against an unbeatable Minimax AI — all wrapped in a sleek Space Plasma theme with light/dark mode.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 vs Computer | Minimax AI that plays a perfect game — you can only draw, never win |
| 👥 2 Players | Local two-player mode on the same device |
| ↩ Undo | Step back one move (or two in AI mode, undoing both your move and the AI's) |
| ↺ Reset | Restart the current round without clearing scores |
| ✦ New Match | Reset the board **and** clear the scoreboard to start fresh |
| 📊 Scoreboard | Tracks wins for X, wins for O/Computer, and draws across rounds |
| 🌙 / ☀️ Theme | Toggle between light and dark mode; preference is saved across sessions |
| 💾 Persistence | Scores and theme preference are saved to `localStorage` |
| ♿ Accessible | Full ARIA roles, live regions for game status, and keyboard-navigable controls |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone or unzip the project
cd tictactoe

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173** (or the next free port).

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Serve it with any static file host.

```bash
# Preview the production build locally
npm run preview
```

---

## 📁 Project Structure

```
tictactoe/
├── public/                  # Static assets (favicon, etc.)
├── src/
│   ├── components/
│   │   ├── Board.jsx        # 3×3 grid — renders 9 Cell components
│   │   ├── Cell.jsx         # Individual cell with win-highlight state
│   │   ├── GameStatus.jsx   # Turn indicator, win/draw announcement, AI thinking dots
│   │   ├── ModeSelector.jsx # "vs Computer" / "2 Players" toggle buttons
│   │   ├── ScoreBoard.jsx   # X | Draws | O score display
│   │   └── ThemeToggle.jsx  # Light/dark mode button
│   ├── hooks/
│   │   └── useTicTacToe.js  # All game logic: history, AI, scoring, undo
│   ├── styles/
│   │   └── app.css          # Full design system — tokens, components, animations
│   ├── App.jsx              # Root component — layout, header, footer, wires hooks to UI
│   └── main.jsx             # React DOM entry point
├── index.html               # HTML shell with Google Fonts preconnect
├── vite.config.js           # Vite + React plugin config
├── package.json
├── .env.development         # VITE_APP_NAME, VITE_API_MODE for dev
└── .env.production          # VITE_APP_NAME, VITE_API_MODE for prod
```

---

## 🧠 How the AI Works

The AI uses the **Minimax algorithm** — a classic game-tree search that explores every possible future board state to find the optimal move.

```
minimax(board, isMaximising)
  └─ if terminal state → return score (+10 win, -10 loss, 0 draw)
  └─ for each empty cell:
       place piece → recurse → undo
  └─ return max score (AI's turn) or min score (player's turn)
```

- The AI plays as **O** and always maximises O's score.
- The player plays as **X** and the algorithm minimises X's score.
- Because Minimax explores the entire game tree with no depth limit, the AI plays a **theoretically perfect** game — the best outcome a human can achieve is a draw.

---

## 🎮 Game Rules

1. The board is a 3×3 grid. Players take turns marking cells with **X** or **O**.
2. **X always goes first.**
3. The first player to get **3 in a row** (horizontally, vertically, or diagonally) wins the round.
4. If all 9 cells are filled with no winner, the round is a **draw**.
5. Scores accumulate across rounds until **New Match** is clicked.

---

## 🗂️ Key Components Reference

### `useTicTacToe(mode)` — `src/hooks/useTicTacToe.js`

The core custom hook. Accepts `'1p'` (vs AI) or `'2p'` (two players).

| Export | Type | Description |
|---|---|---|
| `squares` | `Array(9)` | Current board — `null`, `'X'`, or `'O'` per cell |
| `currentPlayer` | `'X' \| 'O'` | Whose turn it is |
| `gameOver` | `boolean` | Whether the round has ended |
| `winResult` | `{ player, line } \| null` | Winning player and the 3-cell winning line indices |
| `isDraw` | `boolean` | Whether the round ended in a draw |
| `scores` | `{ X, O, draws }` | Cumulative score object |
| `isAiThinking` | `boolean` | `true` during the AI's 380ms deliberation delay |
| `handleCellClick(index)` | `function` | Place the current player's mark on a cell |
| `handleUndo()` | `function` | Step back one (2p) or two (1p) moves |
| `resetGame()` | `function` | Clear the board, keep scores |
| `newMatch()` | `function` | Clear the board **and** reset scores to 0 |
| `canUndo` | `boolean` | Whether undo is currently possible |

### `calculateWinner(squares)` — exported from the same file

```js
import { calculateWinner } from './hooks/useTicTacToe';
// Returns { player: 'X'|'O', line: [a, b, c] } or null
```

---

## 🎨 Theming & Customisation

All colours and spacing are defined as **CSS custom properties** (variables) in `src/styles/app.css` under the `/* 1. TOKENS */` section.

```css
:root {
  --x-color:   #7c3aed;   /* Violet — Player X */
  --o-color:   #0ea5e9;   /* Cyan   — Player O / Computer */
  --accent:    #7c3aed;
  --font-ui:   'Space Grotesk', system-ui, sans-serif;
  --font-mono: 'Space Mono', monospace;
}
```

To change the colour scheme, update these tokens. The dark theme overrides live in `[data-theme="dark"] { … }` immediately below.

### Environment Variables

| Variable | File | Purpose |
|---|---|---|
| `VITE_APP_NAME` | both `.env.*` | Display name shown in the header title |
| `VITE_API_MODE` | both `.env.*` | Set to `'development'` to show a ⚙ dev build footer badge |

---

## 🛠️ Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR at `localhost:5173` |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the `dist/` build locally for final checks |

---

## 📦 Dependencies

| Package | Version | Role |
|---|---|---|
| `react` | ^18.3.1 | UI library |
| `react-dom` | ^18.3.1 | DOM renderer |
| `vite` | ^5.4.2 | Build tool & dev server |
| `@vitejs/plugin-react` | ^4.3.1 | Vite plugin for JSX/React Fast Refresh |

No external UI libraries, no CSS frameworks — all styling is hand-crafted.

---

## 📝 License

Private project. All rights reserved.
