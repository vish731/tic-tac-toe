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
      <p className="text-center text-xs text-cabinet-soft">
        Connect your wallet to see your onchain record.
      </p>
    );
  }

  if (isLoading && data === undefined) {
    return <p className="text-center text-xs text-cabinet-soft">Loading onchain record…</p>;
  }

  if (isError && data === undefined) {
    return (
      <p className="text-center text-xs text-cabinet-soft">
        Couldn&apos;t read the contract. Has it been deployed and configured yet?
      </p>
    );
  }

  const [wins, losses, draws] = data ?? [0n, 0n, 0n];

  return (
    <div className="flex justify-between rounded-2xl border border-cabinet-border bg-cabinet-grid px-4 py-3 text-center">
      <div className="flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
          Onchain Wins
        </span>
        <span className="font-display text-xl font-bold text-amber">{wins.toString()}</span>
      </div>
      <div className="flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
          Losses
        </span>
        <span className="font-display text-xl font-bold text-cabinet-text">{losses.toString()}</span>
      </div>
      <div className="flex-1">
        <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cabinet-soft">
          Draws
        </span>
        <span className="font-display text-xl font-bold text-mint">{draws.toString()}</span>
      </div>
    </div>
  );
}
