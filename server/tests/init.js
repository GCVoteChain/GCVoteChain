const bcrypt = require('bcryptjs');
const { keccak256, solidityPacked } = require('ethers');
const userModel = require('../models/userModel');

const electionModel = require('../models/electionModel');
const candidateModel = require('../models/candidateModel');

const db = require('../data/db');


async function createUsers() {
    for (let i = 0; i < 100; i++ ) {
        try {
            const userId = `user${i + 1}`;

            const exists = userModel.getUser(userId);
            if (exists) continue;

            const hashedPassword = await bcrypt.hash('user123', 6);
            const voterId = keccak256(solidityPacked(['string', 'string'], [userId, 'voter']));

            userModel.registerUser(voterId, userId, hashedPassword, userId, '', 'voter');
        } catch (err) {
            console.log('Failed to create user:', err);
        }
    }
}

async function createElection() {
    try {
        if (electionModel.getById('demo_election')) return;
        electionModel.addElection('demo_election', 'demo');
    } catch (err) {
        console.log('Failed to create election:', err);
    }
}

async function createCandidates() {
    const POSITIONS = [
        'President',
        'Vice President',
        'Secretary',
        'Treasurer',
        'Auditor',
        'PRO'
    ];

    const getStmt = db.prepare(`
        SELECT * FROM candidates
        WHERE election_id = 'demo_election' AND id = ?
    `);

    try {
        POSITIONS.forEach((position, index) => {
            for (let i = 0; i < 3; i++) {
                const id = index * 3 + i + 1;

                if (getStmt.get(id)) continue;
    
                candidateModel.addCandidate(
                    `candidate${id}`,
                    `user${id}`,
                    'demo_election',
                    `Candidate ${id}`,
                    position
                );
            }
        })
    } catch (err) {
        console.log('Failed to create candidate:', err);
    }
}

(async () => {
    await createUsers();
    await createElection();
    await createCandidates();

    console.log('Initialized');
})()