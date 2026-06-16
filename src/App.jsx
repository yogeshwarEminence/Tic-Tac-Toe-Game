// App.jsx — root component
import React, { useState, useEffect } from 'react';
import Board from './components/Board';
import ScoreBoard from './components/ScoreBoard';
import GameStatus from './components/GameStatus';
import ThemeToggle from './components/ThemeToggle';
import ModeSelector from './components/ModeSelector';
import { useTicTacToe } from './hooks/useTicTacToe';
import './styles/app.css';

const APP_NAME = import.meta.env.VITE_APP_NAME || 'Tic Tac Toe';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('ttt_theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [mode, setMode] = useState(() => localStorage.getItem('ttt_mode') || '2p');

  const {
    squares,
    currentPlayer,
    gameOver,
    winResult,
    isDraw,
    scores,
    isAiThinking,
    handleCellClick,
    handleUndo,
    resetGame,
    newMatch,
    canUndo,
  } = useTicTacToe(mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('ttt_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    localStorage.setItem('ttt_mode', newMode);
  };

  return (
    <div className={`app ${gameOver && winResult ? 'app--win' : ''} ${gameOver && isDraw ? 'app--draw' : ''}`}>
      <header className="app__header">
        <div className="app__brand">
          {/* Tic-Tac-Toe grid logo */}
          <svg className="app__logo" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
            {/* Grid lines */}
            <line x1="15" y1="4"  x2="15" y2="40" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="29" y1="4"  x2="29" y2="40" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="4"  y1="15" x2="40" y2="15" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
            <line x1="4"  y1="29" x2="40" y2="29" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
            {/* X top-left */}
            <line x1="6"  y1="6"  x2="13" y2="13" stroke="#7c3aed" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="13" y1="6"  x2="6"  y2="13" stroke="#7c3aed" strokeWidth="2.8" strokeLinecap="round"/>
            {/* O center */}
            <circle cx="22" cy="22" r="4.5" fill="none" stroke="#0ea5e9" strokeWidth="2.8"/>
            {/* X bottom-right */}
            <line x1="31" y1="31" x2="38" y2="38" stroke="#7c3aed" strokeWidth="2.8" strokeLinecap="round"/>
            <line x1="38" y1="31" x2="31" y2="38" stroke="#7c3aed" strokeWidth="2.8" strokeLinecap="round"/>
          </svg>
          <h1 className="app__title">{APP_NAME}</h1>
        </div>
        <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      </header>

      <main className="app__main">
        <div className="game-card">
          <ModeSelector mode={mode} onModeChange={handleModeChange} />
          <ScoreBoard scores={scores} mode={mode} />
          <GameStatus
            currentPlayer={currentPlayer}
            winResult={winResult}
            isDraw={isDraw}
            isAiThinking={isAiThinking}
            mode={mode}
          />
          <Board
            squares={squares}
            onCellClick={handleCellClick}
            winningLine={winResult ? winResult.line : null}
            isAiThinking={isAiThinking}
          />
          <div className="controls" role="group" aria-label="Game controls">
            <button className="btn btn--ghost" onClick={handleUndo} disabled={!canUndo} aria-label="Undo last move">
              ↩ Undo
            </button>
            <button className="btn btn--secondary" onClick={resetGame} aria-label="Reset current game">
              ↺ Reset
            </button>
            <button className="btn btn--primary" onClick={newMatch} aria-label="Start new match and clear scores">
              ✦ New Match
            </button>
          </div>
        </div>
      </main>

      <footer className="app__footer">
        <span>{import.meta.env.VITE_API_MODE === 'development' ? '⚙ dev build' : '© 2025 Tic Tac Toe'}</span>
      </footer>
    </div>
  );
}

export default App;
