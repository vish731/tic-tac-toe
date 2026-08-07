'use client';

import { ConnectWallet } from './ConnectWallet';
import { useAccount } from 'wagmi';

export function Onboarding({ onStart }) {
  const { isConnected } = useAccount();

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-5 flex items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo to-violet shadow-soft">
          <span className="font-display text-sm font-extrabold text-white">XO</span>
        </div>
        <span className="font-display text-lg font-extrabold text-ink">TicTacToe</span>
      </div>

      <div className="rounded-3xl border border-line bg-surface p-7 text-center shadow-soft">
        <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-semibold text-soft">
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald" />
          Ready to play
        </p>

        <h1 className="font-display mb-2 text-3xl font-extrabold leading-tight text-ink">
          Play smart.
          <br />
          <span className="bg-gradient-to-r from-indigo to-violet bg-clip-text text-transparent">
            Win onchain.
          </span>
        </h1>
        <p className="mx-auto mb-6 max-w-xs text-sm text-soft">
          Connect your wallet to start. Every game you play against the computer can be saved
          permanently on Base.
        </p>

        <div className="mb-6 grid grid-cols-1 gap-2.5 text-left">
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3">
            <span className="text-lg">👥</span>
            <div>
              <p className="text-sm font-semibold text-ink">2 Players</p>
              <p className="text-xs text-faint">Pass the device to a friend</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3">
            <span className="text-lg">💻</span>
            <div>
              <p className="text-sm font-semibold text-ink">Vs Computer</p>
              <p className="text-xs text-faint">Easy, medium, or unbeatable hard</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-line bg-canvas px-4 py-3">
            <span className="text-lg">💾</span>
            <div>
              <p className="text-sm font-semibold text-ink">Save onchain</p>
              <p className="text-xs text-faint">Every vs-computer result, on Base</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <ConnectWallet />
        </div>

        <button
          onClick={onStart}
          disabled={!isConnected}
          className="w-full rounded-full bg-gradient-to-r from-indigo to-violet px-4 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
        >
          Start Playing →
        </button>

        {!isConnected && (
          <p className="mt-3 text-xs text-faint">Connect your wallet above to start playing.</p>
        )}
      </div>
    </div>
  );
}
