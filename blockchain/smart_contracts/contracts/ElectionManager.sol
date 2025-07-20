// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './utils/IAdminManager.sol';
import './utils/Candidate.sol';

contract ElectionManager {
    IAdminManager private adminManager;
    
    enum Position { President, VicePresident, Secretary, Treasurer }
    uint positionCount = 4;

    struct Election {
        string title;
        uint startTime;
        uint endTime;

        bool onGoing;
        bool hasEnded;
        
        mapping(Position => Candidate[]) candidates;
        mapping(bytes32 => bool) hasVoted;

        bytes32[] hasVotedKeys;
        
        bool exists;
    }

    mapping(bytes32 => Election) private elections;
    uint electionCount;


    constructor(address adminManagerAddress) {
        adminManager = IAdminManager(adminManagerAddress);
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

    
    function createElection(bytes32 id, string calldata title, uint startTime, uint endTime) external onlyAdmin {
        require(startTime < endTime, 'Invalid time range');
        
        Election storage e = elections[id];
        e.title = title;
        e.startTime = startTime;
        e.endTime = endTime;
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
    }

    function cancelElection(bytes32 id) external onlyAdmin validateElection(id) {
        require(elections[id].endTime > block.timestamp, 'This election has not yet ended');

        for (uint i = 0; i < positionCount; i++) {
            Position pos = Position(i);

            for (uint j = 0; j < elections[id].candidates[pos].length; j++) {
                delete elections[id].candidates[pos][j];
            }
            delete elections[id].candidates[pos];
        }

        for (uint i = 0; i < elections[id].hasVotedKeys.length; i++) {
            bytes32 key = elections[id].hasVotedKeys[i];
            delete elections[id].hasVoted[key];
            delete elections[id].hasVotedKeys[i];
        }

        delete elections[id];
    }

    function finalizeElection(bytes32 id) external onlyAdmin {
        require(elections[id].exists, 'Invalid ID: does not exists');
        require(elections[id].endTime > block.timestamp, 'This election has not yet ended');

        elections[id].onGoing = false;
        elections[id].hasEnded = true;
    }

    function vote(bytes32 electionId, bytes32 voterId, Candidate[] calldata votes) external validateElection(electionId) {
        require(!elections[electionId].hasVoted[voterId], 'Already voted');

        Election storage e = elections[electionId];

        for (uint i = 0; i < votes.length; i++) {
            Position pos = Position(i);

            e.candidates[pos].push(votes[i]);
        }

        e.hasVoted[voterId] = true;
        e.hasVotedKeys.push(voterId);
    }
}