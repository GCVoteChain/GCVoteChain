// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;


interface IAdminManager {
    function isAdmin(address addr) external view returns (bool);
}