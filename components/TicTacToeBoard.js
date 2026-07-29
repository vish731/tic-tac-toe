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
  const [showBadge, setShowBadge] = useState(false);

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
    setShowBadge(false);
  }

  function fullReset() {
    setScores({ X: 0, Y: 0, draws: 0 });
    resetGame();
  }

  function announce(next, result) {
    setGameActive(false);
    setOutcome(result);
    setBoard(next);
    setShowBadge(true);
    if (result === 'draw') setScores((s) => ({ ...s, draws: s.draws + 1 }));
    else setScores((s) => ({ ...s, [result]: s[result] + 1 }));
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
      if (checkWin(boardCopy, 'Y')) return announce(boardCopy, 'Y');
      if (boardCopy.every((c) => c !== '')) return announce(boardCopy, 'draw');

      setBoard(boardCopy);
      setCurrentPlayer('X');
    }, 300);
  }

  function playMove(idx) {
    if (!gameActive || board[idx] !== '' || thinking) return;
    if (vsComputer && currentPlayer !== 'X') return;

    const next = [...board];
    next[idx] = currentPlayer;

    if (checkWin(next, currentPlayer)) return announce(next, currentPlayer);
    if (next.every((c) => c !== '')) return announce(next, 'draw');

    setBoard(next);
    const nextPlayer = currentPlayer === 'X' ? 'Y' : 'X';
    setCurrentPlayer(nextPlayer);
    if (vsComputer && nextPlayer === 'Y') aiRespond(next);
  }

  const humanResult =
    outcome === 'X' ? RESULT.WIN : outcome === 'Y' ? RESULT.LOSS : outcome === 'draw' ? RESULT.DRAW : null;

  return (
    <div className="mx-auto w-full max-w-md">
      {/* Header, echoes the dashboard's logo + product name */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-violet shadow-soft">
            <span className="font-display text-sm font-extrabold text-white">XO</span>
          </div>
          <span className="font-display text-lg font-extrabold text-ink">TicTacToe</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 shadow-card">
          <span className="pulse-dot h-2 w-2 rounded-full bg-emerald" />
          <span className="text-xs font-semibold text-soft">
            {!gameActive ? 'Round over' : thinking ? 'Thinking' : `${currentPlayer}'s turn`}
          </span>
        </div>
      </div>

      <div className="relative rounded-3xl border border-line bg-surface p-6 shadow-soft">
        {/* Floating milestone badge — signature element, mirrors the dashboard's toast notifications */}
        {showBadge && outcome && (
          <div className="badge-in absolute -top-4 right-4 flex items-center gap-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-soft">
            <span className="text-xl">{outcome === 'draw' ? '🤝' : '🏆'}</span>
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-faint">
                {outcome === 'draw' ? 'Draw' : 'Winner'}
              </p>
              <p className="font-display text-sm font-bold text-ink">
                {outcome === 'draw' ? "It's a tie" : `${outcome} takes it`}
              </p>
            </div>
          </div>
        )}

        <div className="mb-5">
          <OnchainStats />
        </div>

        {/* Mode toggle */}
        <div className="mb-4 flex gap-1 rounded-full bg-canvas p-1">
          <button
            onClick={() => {
              setVsComputer(false);
              resetGame();
            }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
              !vsComputer ? 'bg-surface text-ink shadow-card' : 'text-soft hover:text-ink'
            }`}
          >
            2 Players
          </button>
          <button
            onClick={() => {
              setVsComputer(true);
              resetGame();
            }}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-all ${
              vsComputer ? 'bg-surface text-ink shadow-card' : 'text-soft hover:text-ink'
            }`}
          >
            Vs Computer
          </button>
        </div>

        {vsComputer && (
          <div className="mb-5 flex justify-center gap-2">
            {['easy', 'medium', 'hard'].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold capitalize transition-all ${
                  difficulty === d
                    ? 'bg-gradient-to-r from-indigo to-violet text-white shadow-soft'
                    : 'border border-line text-soft hover:border-indigo/40 hover:text-ink'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        {/* Stat trio, echoes the dashboard's "10K+ / 99.9% / 50M+" row */}
        <div className="mb-5 grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-canvas py-3">
          <div className="text-center">
            <p className="font-display text-xl font-extrabold text-indigo">{scores.X}</p>
            <p className="text-[0.68rem] font-medium text-faint">X Wins</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-extrabold text-ink">{scores.draws}</p>
            <p className="text-[0.68rem] font-medium text-faint">Draws</p>
          </div>
          <div className="text-center">
            <p className="font-display text-xl font-extrabold text-emerald">{scores.Y}</p>
            <p className="text-[0.68rem] font-medium text-faint">Y Wins</p>
          </div>
        </div>

        {/* Board */}
        <div className="mb-5 grid grid-cols-3 gap-2.5">
          {board.map((val, i) => {
            const isWinCell = winningLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => playMove(i)}
                className={`font-display aspect-square rounded-2xl border text-4xl font-extrabold transition-all active:scale-95 ${
                  isWinCell
                    ? 'border-indigo/30 bg-gradient-to-br from-indigo/10 to-violet/10'
                    : 'border-line bg-canvas hover:border-indigo/25 hover:bg-white'
                }`}
              >
                {val && (
                  <span
                    key={`${i}-${val}`}
                    className={`mark-in inline-block ${val === 'X' ? 'text-indigo' : 'text-emerald'}`}
                  >
                    {val}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mb-1 flex justify-center gap-2.5">
          <button
            onClick={resetGame}
            className="rounded-full bg-gradient-to-r from-indigo to-violet px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            New Game
          </button>
          <button
            onClick={fullReset}
            className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-soft transition-all hover:border-ink/20 hover:text-ink"
          >
            Reset
          </button>
        </div>

        {!gameActive && vsComputer && humanResult !== null && (
          <div className="mt-4">
            <SaveResultButton result={humanResult} />
          </div>
        )}
      </div>
    </div>
  );
}
