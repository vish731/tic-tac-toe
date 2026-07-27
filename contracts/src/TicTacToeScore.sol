// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title TicTacToeScore
/// @notice Stores each player's win/loss/draw record onchain.
///         Result is always recorded from the connected player's
///         point of view when playing against the computer.
contract TicTacToeScore {
    struct Stats {
        uint256 wins;
        uint256 losses;
        uint256 draws;
    }

    // result codes: 0 = win, 1 = loss, 2 = draw
    uint8 public constant WIN = 0;
    uint8 public constant LOSS = 1;
    uint8 public constant DRAW = 2;

    mapping(address => Stats) private _stats;

    event ResultRecorded(address indexed player, uint8 result);

    /// @notice Record the outcome of a finished game for msg.sender.
    /// @param result 0 = win, 1 = loss, 2 = draw
    function recordResult(uint8 result) external {
        require(result <= DRAW, "invalid result");

        if (result == WIN) {
            _stats[msg.sender].wins += 1;
        } else if (result == LOSS) {
            _stats[msg.sender].losses += 1;
        } else {
            _stats[msg.sender].draws += 1;
        }

        emit ResultRecorded(msg.sender, result);
    }

    /// @notice Read a player's onchain record.
    function getStats(address player)
        external
        view
        returns (uint256 wins, uint256 losses, uint256 draws)
    {
        Stats memory s = _stats[player];
        return (s.wins, s.losses, s.draws);
    }
}
