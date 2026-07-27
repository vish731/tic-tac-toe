// ⚠️ Fill this in after you deploy contracts/src/TicTacToeScore.sol
// (see README.md → "Deploy the contract"). Until then this is a
// placeholder and reads/writes will fail.
export const TIC_TAC_TOE_SCORE_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? '0x0000000000000000000000000000000000000000';

// Mirrors contracts/src/TicTacToeScore.sol — keep in sync if you change the contract.
export const ticTacToeScoreAbi = [
  {
    type: 'function',
    name: 'recordResult',
    inputs: [{ name: 'result', type: 'uint8' }], // 0 = win, 1 = loss, 2 = draw
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getStats',
    inputs: [{ name: 'player', type: 'address' }],
    outputs: [
      { name: 'wins', type: 'uint256' },
      { name: 'losses', type: 'uint256' },
      { name: 'draws', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ResultRecorded',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'result', type: 'uint8', indexed: false },
    ],
    anonymous: false,
  },
];

// Result codes used by recordResult() — keep in sync with the contract.
export const RESULT = {
  WIN: 0,
  LOSS: 1,
  DRAW: 2,
};
