# Onchain Tic Tac Toe — based-flappy jaisi structure mein

⚠️ Ek honest baat pehle: tera `vish731/based-flappy` repo private/inaccessible tha, to uske andar ka actual code main nahi padh paya. Lekin jo folder pattern screenshot mein dikha — `app/`, `components/`, `lib/` (with `wallet.js`, `Onboarding.js`), `jsconfig.json`, plain `.js` files (TypeScript nahi) — usi pattern se yeh project bana diya hai.

## Structure

```
based-tictactoe/
├── app/
│   ├── layout.js          ← root layout
│   ├── page.js             ← Onboarding → Game flow
│   ├── providers.js         ← wagmi + react-query
│   └── globals.css
├── components/
│   ├── Onboarding.js         ← welcome screen + wallet connect (jaisa flappy mein tha)
│   ├── ConnectWallet.js
│   ├── OnchainStats.js
│   ├── SaveResultButton.js
│   └── TicTacToeBoard.js      ← game logic + UI
├── lib/
│   ├── wallet.js               ← wagmi config (jaisa flappy mein tha)
│   └── ticTacToeScore.js         ← contract address + ABI
├── contracts/
│   ├── src/TicTacToeScore.sol
│   ├── foundry.toml
│   └── .env.example
├── jsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── .env.local.example
```

## Flow kaise chalta hai

1. App khulte hi **Onboarding** screen dikhti hai — game ka short intro + wallet connect button
2. "Start Playing" dabane pe **TicTacToeBoard** khulta hai
3. "Vs Computer" mode mein game khatam hone pe, agar wallet connected hai, to **"Save result onchain"** button aata hai — yeh `lib/ticTacToeScore.js` mein defined contract ko call karta hai

## Step 1 — Install

```bash
npm install
```

## Step 2 — Smart contract deploy kar (Foundry)

Yeh step tujhe khud karna hoga — private key/wallet chahiye, main deploy nahi kar sakta.

```bash
cd contracts
curl -L https://foundry.paradigm.xyz | bash
foundryup
forge init --no-git --force
cp .env.example .env
source .env
cast wallet import deployer --interactive
```

[Base Sepolia faucet](https://docs.base.org/base-chain/network-information/network-faucets) se free testnet ETH le, phir:

```bash
forge create ./src/TicTacToeScore.sol:TicTacToeScore \
  --rpc-url $BASE_SEPOLIA_RPC_URL \
  --account deployer
```

Jo address print hoga, wo copy kar le.

## Step 3 — Contract address app mein daal

```bash
cp .env.local.example .env.local
```

`.env.local` mein:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xTeraDeployedAddressYahan
```

## Step 4 — Run kar

```bash
npm run dev
```

`http://localhost:3000` khol — Onboarding dikhega, wallet connect kar, "Start Playing" daba, "Vs Computer" mein khel, game khatam hone pe "Save result onchain" daba.

## Base App/Base.dev pe publish

```bash
npm i -g vercel
vercel
```

Deploy hone ke baad [Base.dev](https://www.base.dev) pe project register kar (naam, icon, description, screenshots, category, primary URL) — yehi ab Base App ki discovery ka current tareeka hai.

## Mainnet pe le jaane ke liye

1. `lib/wallet.js`, `components/SaveResultButton.js`, `components/OnchainStats.js` — teeno jagah `baseSepolia` ko `base` se replace kar
2. Contract mainnet pe dubara deploy kar (`--rpc-url $BASE_MAINNET_RPC_URL`) — real gas lagega
3. `.env.local` mein naya mainnet address daal

## Agar based-flappy ka repo public/share kar sake

Agar tu repo ko public kar de ya usse relevant files (`lib/wallet.js`, `components/Onboarding.js`) ka content yahan paste kar de, to main is project ko exactly usi implementation se match kar sakta hun — abhi maine sirf naming/folder pattern replicate kiya hai, andar ka actual code apna hai.
