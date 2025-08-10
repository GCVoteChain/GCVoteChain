// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './utils/IElectionManager.sol';
import './utils/IVoterManager.sol';

contract Voting {
    IElectionManager private electionManager;
    IVoterManager private voterManager;

    address private backend;

    constructor(address backendAddress, address electionManagerAddress, address voterManagerAddress) {
        electionManager = IElectionManager(electionManagerAddress);
        voterManager = IVoterManager(voterManagerAddress);

        backend = backendAddress;
    }


    modifier isBackend {
        require(msg.sender == backend);
        _;
    }

    function vote(bytes32 electionId, bytes32 voterId, bytes calldata encryptedVote) external isBackend {
        electionManager.vote(electionId, voterId, encryptedVote);
    }
}