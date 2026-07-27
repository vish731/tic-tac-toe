'use client';

import { useMemo, useState } from 'react';
import { RESULT } from '@/lib/ticTacToeScore';
import { SaveResultButton } from './SaveResultButton';
import { OnchainStats } from './OnchainStats';

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWin(board, player) {
  return WIN_PATTERNS.some((combo) => combo.every((i) => board[i] === player));
}

function emptyIndices(board) {
  return board.reduce((acc, c, i) => (c === '' ? [...acc, i] : acc), []);
}

function randomMove(board) {
  const empty = emptyIndices(board);
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function mediumMove(board) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] === 'Y' && board[b] === 'Y' && board[c] === '') return c;
    if (board[a] === 'Y' && board[c] === 'Y' && board[b] === '') return b;
    if (board[b] === 'Y' && board[c] === 'Y' && board[a] === '') return a;
  }
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] === 'X' && board[b] === 'X' && board[c] === '') return c;
    if (board[a] === 'X' && board[c] === 'X' && board[b] === '') return b;
    if (board[b] === 'X' && board[c] === 'X' && board[a] === '') return a;
  }
  return null;
}

function minimax(board, depth, isMax) {
  if (checkWin(board, 'Y')) return 10 - depth;
  if (checkWin(board, 'X')) return depth - 10;
  if (board.every((c) => c !== '')) return 0;

  if (isMax) {
    let best = -Infinity;
    for (const i of emptyIndices(board)) {
      board[i] = 'Y';
      best = Math.max(best, minimax(board, depth + 1, false));
      board[i] = '';
    }
    return best;
  }
  let best = Infinity;
  for (const i of emptyIndices(board)) {
    board[i] = 'X';
    best = Math.min(best, minimax(board, depth + 1, true));
    board[i] = '';
  }
  return best;
}

function bestHardMove(board) {
  let bestScore = -Infinity;
  let bestIdx = null;
  for (const i of emptyIndices(board)) {
    board[i] = 'Y';
    const score = minimax(board, 0, false);
    board[i] = '';
    if (score > bestScore) {
      bestScore = score;
      bestIdx = i;
    }
  }
  return bestIdx;
}

export function TicTacToeBoard() {
  const [board, setBoard] = useState(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameActive, setGameActive] = useState(true);
  const [vsComputer, setVsComputer] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');
  const [scores, setScores] = useState({ X: 0, Y: 0, draws: 0 });
  const [outcome, setOutcome] = useState(null);
  const [thinking, setThinking] = useState(false);

  const winningLine = useMemo(() => {
    if (!outcome || outcome === 'draw') return [];
    for (const combo of WIN_PATTERNS) {
      if (combo.every((i) => board[i] === outcome)) return combo;
    }
    return [];
  }, [board, outcome]);

  function resetGame() {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setOutcome(null);
  }

  function fullReset() {
    setScores({ X: 0, Y: 0, draws: 0 });
    resetGame();
  }

  function finishGame(next, winner) {
    setGameActive(false);
    setOutcome(winner);
    setScores((s) => ({ ...s, [winner]: s[winner] + 1 }));
    setBoard(next);
  }

  function finishDraw(next) {
    setGameActive(false);
    setOutcome('draw');
    setScores((s) => ({ ...s, draws: s.draws + 1 }));
    setBoard(next);
  }

  function aiRespond(afterBoard) {
    setThinking(true);
    setTimeout(() => {
      const boardCopy = [...afterBoard];
      let move = null;
      if (difficulty === 'easy') move = randomMove(boardCopy);
      else if (difficulty === 'medium') move = mediumMove(boardCopy) ?? randomMove(boardCopy);
      else move = bestHardMove(boardCopy);

      setThinking(false);
      if (move === null) return;

      boardCopy[move] = 'Y';
      if (checkWin(boardCopy, 'Y')) {
        finishGame(boardCopy, 'Y');
        return;
      }
      if (boardCopy.every((c) => c !== '')) {
        finishDraw(boardCopy);
        return;
      }
      setBoard(boardCopy);
      setCurrentPlayer('X');
    }, 300);
  }

  function playMove(idx) {
    if (!gameActive || board[idx] !== '' || thinking) return;
    if (vsComputer && currentPlayer !== 'X') return;

    const next = [...board];
    next[idx] = currentPlayer;

    if (checkWin(next, currentPlayer)) {
      finishGame(next, currentPlayer);
      return;
    }
    if (next.every((c) => c !== '')) {
      finishDraw(next);
      return;
    }

    setBoard(next);
    const nextPlayer = currentPlayer === 'X' ? 'Y' : 'X';
    setCurrentPlayer(nextPlayer);

    if (vsComputer && nextPlayer === 'Y') {
      aiRespond(next);
    }
  }

  const statusText = !gameActive
    ? outcome === 'draw'
      ? "It's a draw!"
      : `${outcome} wins!`
    : thinking
    ? 'Computer is thinking…'
    : `${currentPlayer}'s turn`;

  // Result from the human player's (X's) point of view — this is what
  // gets recorded onchain when playing against the computer.
  const humanResult =
    outcome === 'X' ? RESULT.WIN : outcome === 'Y' ? RESULT.LOSS : outcome === 'draw' ? RESULT.DRAW : null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-t-3xl rounded-b-xl bg-gradient-to-r from-baseblue to-[#2E7CFF] px-5 py-4 shadow-[0_12px_30px_-10px_rgba(0,82,255,0.55)]">
        <div className="marquee-bulbs pointer-events-none absolute inset-0" />
        <h1 className="font-display relative z-10 flex items-center gap-2 text-lg font-bold text-white">
          <span className="h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_2px_#FFB020]" />
          TIC · TAC · TOE
        </h1>
      </div>

      <div className="rounded-b-3xl rounded-t-xl border border-cabinet-border bg-cabinet-card p-5 shadow-[0_20px_45px_-15px_rgba(0,82,255,0.35)]">
        <div className="mb-4">
          <OnchainStats />
        </div>

        <div className="mb-3 flex gap-2 rounded-full border border-cabinet-border bg-cabinet-grid p-1">
          <button
            onClick={() => {
              setVsComputer(false);
              resetGame();
            }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              !vsComputer ? 'bg-baseblue text-white shadow-[0_4px_14px_rgba(0,82,255,0.45)]' : 'text-cabinet-soft'
            }`}
          >
            👥 2 Players
          </button>
          <button
            onClick={() => {
              setVsComputer(true);
              resetGame();
            }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition ${
              vsComputer ? 'bg-baseblue text-white shadow-[0_4px_14px_rgba(0,82,255,0.45)]' : 'text-cabinet-soft'
            }`}
          >
            💻 Vs Computer
          </button>
        </div>

        {vsComputer && (
          <div className="mb-4 flex justify-center">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-full border border-cabinet-border bg-cabinet-cell px-4 py-2 text-sm text-cabinet-text"
            >
              <option value="easy">😊 Easy</option>
              <option value="medium">⚖️ Medium</option>
              <option value="hard">🔥 Hard</option>
            </select>
          </div>
        )}

        <div className="mb-4 flex justify-between rounded-2xl border border-cabinet-border bg-cabinet-grid px-4 py-3 text-center">
          <div className="flex-1">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
              X Wins
            </span>
            <span className="font-display text-2xl font-bold text-amber">{scores.X}</span>
          </div>
          <div className="flex-1">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
              Draws
            </span>
            <span className="font-display text-2xl font-bold text-cabinet-text">{scores.draws}</span>
          </div>
          <div className="flex-1">
            <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
              Y Wins
            </span>
            <span className="font-display text-2xl font-bold text-mint">{scores.Y}</span>
          </div>
        </div>

        <div className="font-display mb-4 rounded-full border border-cabinet-border bg-cabinet-grid py-2 text-center text-base font-semibold">
          {statusText}
        </div>

        <div className="mb-5 grid grid-cols-3 gap-3">
          {board.map((val, i) => {
            const isWinCell = winningLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => playMove(i)}
                className={`font-display aspect-square rounded-2xl border-2 text-5xl font-bold shadow-[inset_0_-3px_0_rgba(0,0,0,0.18)] transition active:scale-95 ${
                  isWinCell ? 'border-baseblue bg-baseblue/10' : 'border-transparent bg-cabinet-cell hover:bg-[#182238]'
                } ${val === 'X' ? 'text-amber' : val === 'Y' ? 'text-mint' : ''}`}
              >
                {val}
              </button>
            );
          })}
        </div>

        <div className="mb-2 flex justify-center gap-3">
          <button
            onClick={resetGame}
            className="rounded-full bg-baseblue px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            🔄 New Game
          </button>
          <button
            onClick={fullReset}
            className="rounded-full border border-cabinet-border px-4 py-2 text-sm font-semibold text-cabinet-text transition hover:-translate-y-0.5"
          >
            🗑️ Reset
          </button>
        </div>

        {!gameActive && vsComputer && humanResult !== null && (
          <div className="mt-4">
            <SaveResultButton result={humanResult} />
          </div>
        )}

        <p className="mt-4 text-center text-[0.7rem] text-cabinet-soft">Built on Base</p>
      </div>
    </div>
  );
}
