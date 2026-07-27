# Onchain Tic Tac Toe

A classic Tic Tac Toe game built on Base, with onchain scorekeeping.

## Features

- **2 Player mode** — play a friend on the same device, pass and play
- **Vs Computer mode** — challenge the AI on 3 difficulty levels:
  - 😊 Easy — random moves
  - ⚖️ Medium — blocks your winning moves and takes its own when it can
  - 🔥 Hard — unbeatable, plays the perfect game every time
- **Wallet connect** — connect your Base/Ethereum wallet right in the app
- **Onchain results** — after a game vs the computer, save your win/loss/draw permanently onchain on Base with one tap, and view your all-time record pulled straight from the smart contract
- **Local scoreboard** — live win/draw/loss tally for the current session
- **Arcade-cabinet UI** — glowing marquee header, Base blue branding, amber/mint X-O markers, sound effects on win/draw
- **Onboarding screen** — quick intro before jumping into the game

## Tech stack

- Next.js (App Router) + React
- wagmi + viem for wallet connection and contract calls
- Tailwind CSS for styling
- A Solidity smart contract (Foundry) deployed on Base, storing each player's wins/losses/draws by wallet address

## How it works

1. Connect your wallet (optional — you can also play without one)
2. Pick 2 Player or Vs Computer mode
3. Play a game
4. If you played vs the computer and want it remembered, tap **Save result onchain** — your wallet will ask you to confirm, and your record updates onchain
