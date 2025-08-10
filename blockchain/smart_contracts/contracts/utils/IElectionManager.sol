// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IElectionManager {
    function vote(bytes32 electionId, bytes32 voterId, bytes calldata encryptedVote) external;
}