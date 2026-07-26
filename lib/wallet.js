import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { baseAccount, injected } from 'wagmi/connectors';

// Using Base Sepolia (testnet) so you can test with free faucet ETH first.
// Switch to `base` (mainnet) in README's "Go to mainnet" section when ready.
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [
    injected(),
    baseAccount({
      appName: 'Onchain Tic Tac Toe',
    }),
  ],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
