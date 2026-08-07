'use client';

import { useState } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [showOptions, setShowOptions] = useState(false);

  if (isReconnecting) {
    return <p className="text-sm text-soft">Reconnecting wallet…</p>;
  }

  if (isConnected) {
    return (
      <div className="flex items-center justify-center gap-3">
        <span className="rounded-full border border-line bg-canvas px-3 py-1.5 font-mono text-xs text-ink">
          {address?.slice(0, 6)}…{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-soft transition-colors hover:text-ink"
        >
          Disconnect
        </button>
      </div>
    );
  }

  // Only one wallet extension detected — connect straight to it, no need
  // to show a picker at all.
  if (!showOptions && connectors.length <= 1) {
    return (
      <button
        onClick={() => connect({ connector: connectors[0] })}
        disabled={isConnecting || isPending}
        className="w-full rounded-full bg-gradient-to-r from-indigo to-violet px-4 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5 disabled:opacity-50"
      >
        {isPending ? 'Confirm in wallet…' : 'Connect Wallet'}
      </button>
    );
  }

  // Multiple wallet extensions detected — single "Connect Wallet" button
  // that reveals a compact picker on click, instead of dumping every
  // detected wallet as its own button.
  if (!showOptions) {
    return (
      <button
        onClick={() => setShowOptions(true)}
        className="w-full rounded-full bg-gradient-to-r from-indigo to-violet px-4 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-canvas p-2">
      {connectors.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect({ connector })}
          disabled={isConnecting || isPending}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors hover:bg-surface disabled:opacity-50"
        >
          {connector.name}
        </button>
      ))}
      <button
        onClick={() => setShowOptions(false)}
        className="mt-1 w-full rounded-xl px-3 py-2 text-center text-xs font-semibold text-faint hover:text-soft"
      >
        Cancel
      </button>
    </div>
  );
}
