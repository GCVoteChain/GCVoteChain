// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

struct Candidate {
    bytes32 id;
    uint votes;

    bool exists;
}