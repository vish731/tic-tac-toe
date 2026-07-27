'use client';

import { ConnectWallet } from './ConnectWallet';
import { useAccount } from 'wagmi';

export function Onboarding({ onStart }) {
  const { isConnected } = useAccount();

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="relative overflow-hidden rounded-t-3xl rounded-b-xl bg-gradient-to-r from-baseblue to-[#2E7CFF] px-5 py-4 shadow-[0_12px_30px_-10px_rgba(0,82,255,0.55)]">
        <div className="marquee-bulbs pointer-events-none absolute inset-0" />
        <h1 className="font-display relative z-10 flex items-center gap-2 text-lg font-bold text-white">
          <span className="h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_2px_#FFB020]" />
          TIC · TAC · TOE
        </h1>
      </div>

      <div className="rounded-b-3xl rounded-t-xl border border-cabinet-border bg-cabinet-card p-6 text-center shadow-[0_20px_45px_-15px_rgba(0,82,255,0.35)]">
        <p className="font-display mb-1 text-2xl font-bold">Welcome 👋</p>
        <p className="mb-6 text-sm text-cabinet-soft">
          Play a friend on the same device, or challenge the computer on 3 difficulty levels.
          Connect your wallet if you want your vs-computer results saved onchain on Base.
        </p>

        <div className="mb-6 space-y-2 rounded-2xl border border-cabinet-border bg-cabinet-grid p-4 text-left text-sm text-cabinet-soft">
          <p>👥 <span className="text-cabinet-text">2 Players</span> — pass the device back and forth, no wallet needed</p>
          <p>💻 <span className="text-cabinet-text">Vs Computer</span> — pick easy / medium / hard</p>
          <p>💾 <span className="text-cabinet-text">Save onchain</span> — optional, requires a connected wallet</p>
        </div>

        <div className="mb-4">
          <ConnectWallet />
        </div>

        <button
          onClick={onStart}
          className="w-full rounded-full bg-baseblue px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          🎮 Start Playing
        </button>

        {!isConnected && (
          <p className="mt-3 text-xs text-cabinet-soft">
            You can also play without connecting — onchain saving just won&apos;t be available.
          </p>
        )}
      </div>
    </div>
  );
}
