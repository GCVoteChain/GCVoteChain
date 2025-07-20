// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import './utils/IAdminManager.sol';

contract VoterManager {
    IAdminManager private adminManager;

    mapping(bytes32 => bool) registeredVoters;


    constructor(address adminManagerAddress) {
        adminManager = IAdminManager(adminManagerAddress);
    }


    modifier onlyAdmin {
        require(adminManager.isAdmin(msg.sender));
        _;
    }

    function isRegistered(bytes32 id) external view returns (bool) {
        return registeredVoters[id];
    }

    function registerVoter(bytes32 id) external onlyAdmin {
        require(!registeredVoters[id], 'Already registered');

        registeredVoters[id] = true;
    }

    function removeVoter(bytes32 id) external onlyAdmin {
        require(registeredVoters[id], 'Invalid ID: Does not exists');

        delete registeredVoters[id];
    }
}