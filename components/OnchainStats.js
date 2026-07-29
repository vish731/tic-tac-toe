'use client';

import { useAccount, useReadContract } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { TIC_TAC_TOE_SCORE_ADDRESS, ticTacToeScoreAbi } from '@/lib/ticTacToeScore';

export function onchainStatsQueryKeyArgs(address) {
  return {
    address: TIC_TAC_TOE_SCORE_ADDRESS,
    abi: ticTacToeScoreAbi,
    functionName: 'getStats',
    args: [address ?? '0x0000000000000000000000000000000000000000'],
    chainId: baseSepolia.id,
  };
}

export function OnchainStats() {
  const { address, isConnected } = useAccount();

  const { data, isLoading, isError } = useReadContract({
    ...onchainStatsQueryKeyArgs(address),
    query: { enabled: isConnected && !!address },
  });

  if (!isConnected) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-canvas px-4 py-3 text-center">
        <p className="text-xs text-faint">Connect your wallet to see your onchain record.</p>
      </div>
    );
  }

  if (isLoading && data === undefined) {
    return (
      <div className="rounded-2xl border border-line bg-canvas px-4 py-3 text-center">
        <p className="text-xs text-faint">Loading onchain record…</p>
      </div>
    );
  }

  if (isError && data === undefined) {
    return (
      <div className="rounded-2xl border border-line bg-canvas px-4 py-3 text-center">
        <p className="text-xs text-faint">Couldn&apos;t read the contract yet.</p>
      </div>
    );
  }

  const [wins, losses, draws] = data ?? [0n, 0n, 0n];

  return (
    <div className="flex items-center justify-between rounded-2xl border border-line bg-gradient-to-r from-indigo/5 to-violet/5 px-4 py-3">
      <span className="flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-wide text-faint">
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald" />
        Onchain
      </span>
      <div className="flex gap-4 text-center">
        <div>
          <p className="font-display text-base font-extrabold text-indigo">{wins.toString()}</p>
          <p className="text-[0.62rem] text-faint">Wins</p>
        </div>
        <div>
          <p className="font-display text-base font-extrabold text-ink">{losses.toString()}</p>
          <p className="text-[0.62rem] text-faint">Losses</p>
        </div>
        <div>
          <p className="font-display text-base font-extrabold text-emerald">{draws.toString()}</p>
          <p className="text-[0.62rem] text-faint">Draws</p>
        </div>
      </div>
    </div>
  );
}
