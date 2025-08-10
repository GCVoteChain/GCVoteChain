// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './utils/IAdminManager.sol';
import './utils/IVoterManager.sol';
import './utils/Candidate.sol';

contract ElectionManager {
    IAdminManager private adminManager;
    IVoterManager private voterManager;
    
    enum Position { President, VicePresident, Secretary, Treasurer }
    uint positionCount = 4;

    struct Election {
        string title;
        uint startTime;
        uint endTime;

        bool onGoing;
        bool hasEnded;
        
        mapping(Position => mapping(bytes32 => Candidate)) candidates;
        mapping(Position => uint) candidateCount;
        mapping(Position => bytes32[]) candidateKeys;

        mapping(bytes32 => bool) candidateRegistered;

        mapping(bytes32 => bool) hasVoted;

        bytes32[] hasVotedKeys;
        
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

    
    function createElection(bytes32 id, string calldata title) external onlyAdmin {
        Election storage e = elections[id];
        e.title = title;
        e.onGoing = false;
        e.hasEnded = false;
        e.exists = true;

        electionCount++;
    }

    function setElectionSchedule(bytes32 id, uint startTime, uint endTime) external onlyAdmin validateElection(id) {
        require(startTime < endTime, 'Invalid time range');
        require(startTime > block.timestamp, 'Start time must be in the future');
        
        Election storage e = elections[id];
        e.startTime = startTime;
        e.endTime = endTime;
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

    function removeElection(bytes32 id) external onlyAdmin validateElection(id) {
        for (uint i = 0; i < positionCount; i++) {
            Position pos = Position(i);

            for (uint j = 0; j < elections[id].candidateKeys[pos].length; j++) {
                bytes32 key = elections[id].candidateKeys[pos][j];

                delete elections[id].candidates[pos][key];

                delete elections[id].candidateRegistered[key];
                delete elections[id].candidateKeys[pos][j];
            }

            delete elections[id].candidateCount[pos];
        }

        for (uint i = 0; i < elections[id].hasVotedKeys.length; i++) {
            bytes32 key = elections[id].hasVotedKeys[i];
            delete elections[id].hasVoted[key];
            delete elections[id].hasVotedKeys[i];
        }

        delete elections[id];
    }

    function vote(bytes32 electionId, bytes32 voterId, Candidate[] calldata votes) external validateElection(electionId) {
        require(!elections[electionId].hasVoted[voterId], 'Already voted');

        Election storage e = elections[electionId];

        for (uint i = 0; i < votes.length; i++) {
            Position pos = Position(i);
            
            require(e.candidateRegistered[votes[i].id], 'This candidate is not registered');

            e.candidates[pos][votes[i].id].votes += 1;
        }

        e.hasVoted[voterId] = true;
        e.hasVotedKeys.push(voterId);
    }

    function getVotes(bytes32 id) external view returns (Candidate[][] memory) {
        require(elections[id].exists, 'This election does not exists');

        Election storage e = elections[id];

        Candidate[][] memory result = new Candidate[][](positionCount);

        for (uint i = 0; i < positionCount; i++) {
            Position pos = Position(i);

            mapping(bytes32 => Candidate) storage candidates = e.candidates[pos];
            Candidate[] memory temp = new Candidate[](e.candidateCount[pos]);

            for (uint j = 0; j < e.candidateCount[pos]; j++) {
                temp[j] = candidates[e.candidateKeys[pos][j]];
            }

            result[i] = temp;
        }

        return result;
    }


    function registerCandidate(bytes32 electionId, bytes32 candidateId, uint position) external electionExists(electionId) {
        require(voterManager.isRegistered(candidateId), 'Not registered');
        require(!elections[electionId].candidateRegistered[candidateId], 'Already a candidate');

        Election storage e = elections[electionId];

        Candidate memory newCandidate = Candidate({
            id: candidateId,
            votes: 0,
            exists: true
        });

        Position pos = Position(position);

        e.candidates[pos][candidateId] = newCandidate;
        e.candidateCount[pos] += 1;
        e.candidateKeys[pos].push(candidateId);
        e.candidateRegistered[candidateId] = true;
    }
}