// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './Candidate.sol';

interface IElectionManager {
    function vote(bytes32 electionid, bytes32 voterId, Candidate[] calldata votes) external;
}