// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IVoterManager {
    function isRegistered(bytes32 id) external view returns (bool);
}