// ScoreBoard.jsx — X wins, O wins, draws (labels adapt to mode)
import React from 'react';

function ScoreBoard({ scores, mode }) {
  const oLabel = mode === '1p' ? 'Computer' : 'Player O';

  const items = [
    { label: 'Player X', key: 'X', symbol: 'X' },
    { label: 'Draws',    key: 'draws', symbol: '—' },
    { label: oLabel,     key: 'O', symbol: 'O' },
  ];

  return (
    <div className="scoreboard" role="region" aria-label="Scoreboard">
      {items.map(({ label, key, symbol }) => (
        <div key={key} className={`scoreboard__item scoreboard__item--${key.toLowerCase()}`}>
          <span className="scoreboard__symbol" aria-hidden="true">{symbol}</span>
          <span className="scoreboard__count" aria-label={`${label}: ${scores[key]}`}>
            {scores[key]}
          </span>
          <span className="scoreboard__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

export default React.memo(ScoreBoard);