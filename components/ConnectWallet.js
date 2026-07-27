'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';

export function ConnectWallet() {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isReconnecting) {
    return <p className="text-sm text-cabinet-soft">Reconnecting wallet…</p>;
  }

  if (!isConnected) {
    return (
      <div className="flex flex-wrap justify-center gap-2">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            disabled={isConnecting || isPending}
            className="rounded-full border border-cabinet-border bg-cabinet-cell px-4 py-2 text-sm font-semibold text-cabinet-text transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {isPending ? 'Confirm in wallet…' : `Connect ${connector.name}`}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3">
      <span className="rounded-full border border-cabinet-border bg-cabinet-cell px-3 py-1.5 font-mono text-xs text-cabinet-text">
        {address?.slice(0, 6)}…{address?.slice(-4)}
      </span>
      <button
        onClick={() => disconnect()}
        className="rounded-full border border-cabinet-border px-3 py-1.5 text-xs font-semibold text-cabinet-soft transition hover:text-cabinet-text"
      >
        Disconnect
      </button>
    </div>
  );
}
