// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

struct Candidate {
    uint id;
    string name;
    uint votes;

    bool exists;
}