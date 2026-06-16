// Board.jsx — 3×3 grid of cells
import React from 'react';
import Cell from './Cell';

function Board({ squares, onCellClick, winningLine, isAiThinking }) {
  return (
    <div
      className={`board ${isAiThinking ? 'board--thinking' : ''}`}
      role="grid"
      aria-label="Tic Tac Toe board"
      aria-busy={isAiThinking}
    >
      {squares.map((value, index) => (
        <Cell
          key={index}
          index={index}
          value={value}
          onClick={() => onCellClick(index)}
          isWinning={winningLine ? winningLine.includes(index) : false}
        />
      ))}
    </div>
  );
}

export default React.memo(Board);