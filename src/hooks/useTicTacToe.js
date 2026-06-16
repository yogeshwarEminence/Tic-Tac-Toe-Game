// useTicTacToe.js — game state, logic, history, scoring, AI opponent
import { useState, useCallback, useEffect, useRef } from 'react';

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

const STORAGE_KEY = 'tictactoe_scores';

export function calculateWinner(squares) {
  for (const [a, b, c] of WINNING_LINES) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

// ── Minimax AI (plays as 'O', maximises O, minimises X) ──
function minimax(squares, isMaximising) {
  const result = calculateWinner(squares);
  if (result) return result.player === 'O' ? 10 : -10;
  if (squares.every(Boolean)) return 0;

  const scores = [];
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue;
    const next = squares.slice();
    next[i] = isMaximising ? 'O' : 'X';
    scores.push(minimax(next, !isMaximising));
  }
  return isMaximising ? Math.max(...scores) : Math.min(...scores);
}

function getBestMove(squares) {
  let bestScore = -Infinity;
  let bestIndex = -1;
  for (let i = 0; i < 9; i++) {
    if (squares[i]) continue;
    const next = squares.slice();
    next[i] = 'O';
    const score = minimax(next, false);
    if (score > bestScore) { bestScore = score; bestIndex = i; }
  }
  return bestIndex;
}

function loadScores(mode) {
  try {
    const saved = localStorage.getItem(`${STORAGE_KEY}_${mode}`);
    return saved ? JSON.parse(saved) : { X: 0, O: 0, draws: 0 };
  } catch {
    return { X: 0, O: 0, draws: 0 };
  }
}

function saveScores(scores, mode) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${mode}`, JSON.stringify(scores));
  } catch {}
}

export function useTicTacToe(mode = '2p') {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState(() => loadScores(mode));
  const [gameOver, setGameOver] = useState(false);
  const [winResult, setWinResult] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);
  // Track if score was already counted for this game end
  const scoredRef = useRef(false);

  const squares = history[currentStep];
  const isXTurn = currentStep % 2 === 0;
  const currentPlayer = isXTurn ? 'X' : 'O';
  const isVsAI = mode === '1p';

  // Reset scores when mode changes
  useEffect(() => {
    setScores(loadScores(mode));
    resetGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Detect win/draw whenever board changes
  useEffect(() => {
    const result = calculateWinner(squares);
    if (result && !scoredRef.current) {
      scoredRef.current = true;
      setWinResult(result);
      setGameOver(true);
      setScores(prev => {
        const updated = { ...prev, [result.player]: prev[result.player] + 1 };
        saveScores(updated, mode);
        return updated;
      });
    } else if (!result && squares.every(Boolean) && !scoredRef.current) {
      scoredRef.current = true;
      setIsDraw(true);
      setGameOver(true);
      setScores(prev => {
        const updated = { ...prev, draws: prev.draws + 1 };
        saveScores(updated, mode);
        return updated;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  // AI move — fires after player places X (step becomes odd)
  useEffect(() => {
    if (!isVsAI || gameOver || isXTurn) return; // only on O's turn
    if (calculateWinner(squares) || squares.every(Boolean)) return;

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const best = getBestMove(squares);
      if (best === -1) { setIsAiThinking(false); return; }

      const newSquares = squares.slice();
      newSquares[best] = 'O';
      setHistory(h => {
        const newH = h.slice(0, currentStep + 1);
        return [...newH, newSquares];
      });
      setCurrentStep(s => s + 1);
      setIsAiThinking(false);
    }, 380); // small delay so it feels natural

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, isVsAI, gameOver]);

  const handleCellClick = useCallback((index) => {
    if (gameOver || squares[index] || isAiThinking) return;
    if (isVsAI && !isXTurn) return; // block clicking during AI turn

    const newSquares = squares.slice();
    newSquares[index] = currentPlayer;
    const newHistory = history.slice(0, currentStep + 1);
    setHistory([...newHistory, newSquares]);
    setCurrentStep(newHistory.length);
  }, [gameOver, squares, currentPlayer, history, currentStep, isAiThinking, isVsAI, isXTurn]);

  const handleUndo = useCallback(() => {
    if (currentStep === 0 || isAiThinking) return;
    const stepsBack = isVsAI ? 2 : 1; // undo both AI move and player move
    const targetStep = Math.max(0, currentStep - stepsBack);

    if (gameOver) {
      setGameOver(false);
      setWinResult(null);
      setIsDraw(false);
      scoredRef.current = false;
      setScores(prev => {
        let updated = { ...prev };
        if (winResult) updated[winResult.player] = Math.max(0, updated[winResult.player] - 1);
        else if (isDraw) updated.draws = Math.max(0, updated.draws - 1);
        saveScores(updated, mode);
        return updated;
      });
    }
    setCurrentStep(targetStep);
  }, [currentStep, gameOver, winResult, isDraw, isVsAI, isAiThinking, mode]);

  const resetGame = useCallback(() => {
    setHistory([Array(9).fill(null)]);
    setCurrentStep(0);
    setGameOver(false);
    setWinResult(null);
    setIsDraw(false);
    setIsAiThinking(false);
    scoredRef.current = false;
  }, []);

  const newMatch = useCallback(() => {
    resetGame();
    const fresh = { X: 0, O: 0, draws: 0 };
    setScores(fresh);
    saveScores(fresh, mode);
  }, [resetGame, mode]);

  return {
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
    canUndo: currentStep > 0 && !isAiThinking,
  };
}
