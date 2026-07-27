'use client';

import { useEffect, useState } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useChainId,
  useSwitchChain,
  useAccount,
} from 'wagmi';
import { readContractQueryOptions } from 'wagmi/query';
import { useQueryClient } from '@tanstack/react-query';
import { baseSepolia } from 'wagmi/chains';
import { wagmiConfig } from '@/lib/wallet';
import { TIC_TAC_TOE_SCORE_ADDRESS, ticTacToeScoreAbi } from '@/lib/ticTacToeScore';
import { onchainStatsQueryKeyArgs } from './OnchainStats';

export function SaveResultButton({ result }) {
  const { isConnected, address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { data: hash, isPending, writeContract, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const queryClient = useQueryClient();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries({
        queryKey: readContractQueryOptions(wagmiConfig, onchainStatsQueryKeyArgs(address)).queryKey,
      });
      setSaved(true);
    }
  }, [isSuccess, queryClient, address]);

  if (!isConnected) return null;

  if (saved) {
    return (
      <p className="text-center text-xs font-semibold text-mint">
        Saved onchain ✓{' '}
        {hash && (
          <a
            href={`https://sepolia.basescan.org/tx/${hash}`}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            View on Basescan
          </a>
        )}
      </p>
    );
  }

  if (chainId !== baseSepolia.id) {
    return (
      <button
        onClick={() => switchChain({ chainId: baseSepolia.id })}
        className="w-full rounded-full bg-baseblue px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        disabled={isSwitching}
      >
        {isSwitching ? 'Switching…' : 'Switch to Base Sepolia'}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        reset();
        writeContract({
          address: TIC_TAC_TOE_SCORE_ADDRESS,
          abi: ticTacToeScoreAbi,
          functionName: 'recordResult',
          args: [result],
          chainId: baseSepolia.id,
        });
      }}
      disabled={isPending || isConfirming}
      className="w-full rounded-full bg-baseblue px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
    >
      {isPending ? 'Confirm in wallet…' : isConfirming ? 'Confirming…' : '💾 Save result onchain'}
    </button>
  );
}
