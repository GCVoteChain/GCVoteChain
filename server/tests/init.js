require('dotenv').config({ path: '../.env' });

const bcrypt = require('bcryptjs');
const ethers = require('ethers');

const path = require('path');

const userModel = require('../models/userModel');
const electionModel = require('../models/electionModel');
const candidateModel = require('../models/candidateModel');
const { getAndIncrementNonce } = require('../models/nonceTrackerModel');

const db = require('../data/db');
const { loadContracts, getRevertError } = require('../services/contract');

const keysPath = path.resolve(__dirname, '../../blockchain/smart_contracts/scripts/keys.js');

const { accounts, quorum } = require(keysPath);

const host = quorum?.rpcnode?.url;
const provider = new ethers.JsonRpcProvider(host);
const wallet = new ethers.Wallet(accounts?.a?.privateKey, provider);

const electionId = ethers.keccak256(ethers.solidityPacked(['string'], ['demo_election']));


async function createUsers() {
    const contracts = await loadContracts();

    const transactions = [];
    
    for (let i = 0; i < 100; i++ ) {
        try {
            const userId = `user${i + 1}`;

            const exists = userModel.getUser(userId);
            if (exists) continue;

            const hashedPassword = await bcrypt.hash('user123', 6);
            const voterId = ethers.keccak256(ethers.solidityPacked(['string', 'string'], [userId, 'voter']));

            const nonce = await getAndIncrementNonce();
            
            try {
                await contracts.voterManager.registerVoter.staticCall(voterId, { nonce: nonce });
            } catch {
                continue;
            }

            const tx = await contracts.voterManager.registerVoter(voterId, { nonce: nonce });

            transactions.push(tx);

            userModel.registerUser(voterId, userId, hashedPassword, userId, '', 'voter');
        } catch (err) {
            console.log('Failed to create user:', err);
        }
    }

    await Promise.allSettled(transactions);
}


async function createElection() {
    try {
        if (electionModel.getById(electionId)) return;

        const contracts = await loadContracts();

        await contracts.electionManager.createElection(electionId);
        
        electionModel.addElection(electionId, 'demo');

        await getAndIncrementNonce();
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
                    electionId,
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
    try {
        await createUsers();
        await createElection();
        await createCandidates();
        console.log('Initialized');
    } catch (err) {
        console.error('Initialization failed:', err);
    }
})()