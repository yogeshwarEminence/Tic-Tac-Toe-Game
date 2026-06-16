// ModeSelector.jsx — 1 Player vs 2 Players toggle
import React from 'react';

function ModeSelector({ mode, onModeChange }) {
  return (
    <div className="mode-selector" role="group" aria-label="Game mode">
      <button
        className={`mode-btn ${mode === '1p' ? 'mode-btn--active' : ''}`}
        onClick={() => onModeChange('1p')}
        aria-pressed={mode === '1p'}
      >
        <span className="mode-btn__icon" aria-hidden="true">🤖</span>
        <span>vs Computer</span>
      </button>
      <button
        className={`mode-btn ${mode === '2p' ? 'mode-btn--active' : ''}`}
        onClick={() => onModeChange('2p')}
        aria-pressed={mode === '2p'}
      >
        <span className="mode-btn__icon" aria-hidden="true">👥</span>
        <span>2 Players</span>
      </button>
    </div>
  );
}

export default React.memo(ModeSelector);
