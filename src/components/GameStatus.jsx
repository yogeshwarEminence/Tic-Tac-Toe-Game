// GameStatus.jsx — current turn, winner, draw, or AI thinking
import React from 'react';

function GameStatus({ currentPlayer, winResult, isDraw, isAiThinking, mode }) {
  if (winResult) {
    const label = mode === '1p' && winResult.player === 'O' ? 'Computer' : `Player ${winResult.player}`;
    return (
      <div className="game-status game-status--win" role="status" aria-live="polite">
        <span className={`game-status__player game-status__player--${winResult.player.toLowerCase()}`}>
          {label}
        </span>
        <span className="game-status__text">&nbsp;wins the round!</span>
      </div>
    );
  }

  if (isDraw) {
    return (
      <div className="game-status game-status--draw" role="status" aria-live="polite">
        <span className="game-status__text">It&apos;s a draw!</span>
      </div>
    );
  }

  if (isAiThinking) {
    return (
      <div className="game-status game-status--thinking" role="status" aria-live="polite">
        <span className="thinking-dots" aria-hidden="true">
          <span /><span /><span />
        </span>
        <span className="game-status__text">Computer is thinking…</span>
      </div>
    );
  }

  const turnLabel =
    mode === '1p'
      ? currentPlayer === 'X'
        ? 'Your turn (X)'
        : 'Computer (O)'
      : `Player ${currentPlayer}'s turn`;

  return (
    <div className="game-status" role="status" aria-live="polite">
      <span className={`game-status__player game-status__player--${currentPlayer.toLowerCase()}`}>
        {turnLabel}
      </span>
    </div>
  );
}

export default React.memo(GameStatus);
