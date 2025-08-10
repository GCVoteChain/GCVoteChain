// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './utils/IAdminManager.sol';
import './utils/IVoterManager.sol';

contract ElectionManager {
    IAdminManager private adminManager;
    IVoterManager private voterManager;

    struct Election {
        bool onGoing;
        bool hasEnded;

        bytes[] encryptedVotes;
        mapping(bytes32 => bool) hasVoted;
        
        bool exists;
    }

    mapping(bytes32 => Election) private elections;
    uint electionCount;


    constructor(address adminManagerAddress, address voterManagerAddress) {
        adminManager = IAdminManager(adminManagerAddress);
        voterManager = IVoterManager(voterManagerAddress);
    }

    
    modifier onlyAdmin {
        require(adminManager.isAdmin(msg.sender));
        _;
    }

    modifier electionExists(bytes32 id) {
        require(elections[id].exists);
        _;
    }

    modifier validateElection(bytes32 id) {
        require(elections[id].exists, 'Invalid ID: does not exists');
        require(!elections[id].hasEnded, 'This election has already ended');
        _;
    }

    
    function createElection(bytes32 id) external onlyAdmin {
        Election storage e = elections[id];
        e.onGoing = false;
        e.hasEnded = false;
        e.exists = true;

        electionCount++;
    }
    
    function startElection(bytes32 id) external onlyAdmin validateElection(id) {
        require(!elections[id].onGoing, 'This election has already started');
        
        elections[id].onGoing = true;
    }

    function stopElection(bytes32 id) public onlyAdmin validateElection(id) {
        require(elections[id].onGoing, 'This election has not started yet');
        
        elections[id].onGoing = false;
        elections[id].hasEnded = true;
    }

    function vote(bytes32 electionId, bytes32 voterId, bytes calldata encryptedVote) external validateElection(electionId) {
        require(elections[electionId].onGoing, 'This election has already ended');
        require(!elections[electionId].hasVoted[voterId], 'Already voted');

        Election storage e = elections[electionId];
        e.encryptedVotes.push(encryptedVote);
        e.hasVoted[voterId] = true;
    }
}