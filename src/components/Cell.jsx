// Cell.jsx — individual board cell with animations
import React from 'react';

function Cell({ value, onClick, isWinning, index }) {
  return (
    <button
      className={[
        'cell',
        value ? `cell--${value.toLowerCase()}` : '',
        isWinning ? 'cell--winning' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={onClick}
      disabled={!!value}
      aria-label={
        value
          ? `Cell ${index + 1}: ${value}`
          : `Cell ${index + 1}: empty`
      }
      tabIndex={0}
    >
      {value && (
        <span className="cell__symbol" aria-hidden="true">
          {value}
        </span>
      )}
    </button>
  );
}

export default React.memo(Cell);
