// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

contract AccessControlManager {
    mapping(address => bool) admins;

    constructor(address[] memory adminIDs) {
        for (uint i = 0; i < adminIDs.length; i++) {
            admins[adminIDs[i]] = true;
        }
    }

    function isAdmin(address addr) external view returns (bool) {
        return admins[addr];
    }
}