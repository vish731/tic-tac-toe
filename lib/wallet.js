import { http, createConfig, createStorage, cookieStorage } from 'wagmi';
import { baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

// Using Base Sepolia (testnet) so you can test with free faucet ETH first.
// Switch to `base` (mainnet) in README's "Go to mainnet" section when ready.
//
// Note: only using the `injected` connector (MetaMask, Coinbase Wallet
// browser extension, etc). We dropped the `baseAccount` connector
// because it pulls in @coinbase/cdp-sdk, which has a broken optional
// dependency (@x402/*) that repeatedly broke the Vercel build.
export const wagmiConfig = createConfig({
  chains: [baseSepolia],
  connectors: [injected()],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
  },
});
