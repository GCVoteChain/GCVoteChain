const { keccak256, solidityPacked } = require('ethers');
const electionModel = require('../models/electionModel.js');
const candidateModel = require('../models/candidateModel.js');
const transactionModel = require('../models/transactionModel.js');
const userModel = require('../models/userModel.js');

const ethers = require('ethers');

const { v4: uuidv4 } = require('uuid');

const { loadContracts, getRevertError } = require('../services/contract.js');

const path = require('path');

const keysPath = path.resolve(__dirname, '../../blockchain/smart_contracts/scripts/keys');
const { quorum } = require(keysPath);

const host = quorum?.rpcnode?.url;
const provider = new ethers.JsonRpcProvider(host);


async function add(req, res) {
    try {
        const { title } = req.body;
        const timestamp = Math.floor(Date.now() / 1000);
        const id = keccak256(solidityPacked(['string', 'uint256'], [title, timestamp]));

        const contracts = await loadContracts();

        try {
            await contracts.electionManager.createElection.staticCall(id);
        } catch (err) {
            return res.status(400).send({ message: `Failed to create election: ${getRevertError(err)}`});
        }

        const tx = await contracts.electionManager.createElection(id);
        await tx.wait();

        electionModel.addElection(id, title);

        res.send({ message: 'Election added successfully' });
    } catch (err) {
        console.error('Error creating election:', err);
        res.status(500).send({ message: 'Failed to add election' });
    }
}


async function setSchedule(req, res) {
    try {
        const { id, startTime, endTime } = req.body;

        const start = Math.floor(new Date(startTime).getTime() / 1000);
        const end = Math.floor(new Date(endTime).getTime() / 1000);

        const now = Math.floor(Date.now() / 1000);
        
        if (start >= end) return res.status(400).send({ message: 'Start time must be before the end time' });
        if (start < now) return res.status(400).send({ message: 'Start time must be in the future' });

        const election = electionModel.getById(id);
        if (election.status === 'open' || election.status === 'closed') {
            return res.status(400).send({ message: 'Cannot reset the schedule for an election that is open or closed '});
        }

        electionModel.setElectionSchedule(id, start, end);

        res.send({ message: 'Election scheduled successfully' });
    } catch (err) {
        console.error('Error updating election schedule:', err);
        res.status(500).send({ message: 'Failed to update election schedule' });
    }
}


async function setStatus(req, res) {
    try {
        const { id, status } = req.body;

        electionModel.setElectionStatus(id, status);

        res.send({ message: 'Election status updated successfully' });
    } catch (err) {
        console.error('Error updating election status:', err);
        res.status(500).send({ message: 'Failed to update election status' });
    }
}


async function remove(req, res) {
    try {
        const { id } = req.body;

        electionModel.addElection(id, title);

        res.send({ message: 'Election added successfully' });
    } catch (err) {
        console.error('Error removing election:', err);
        res.status(500).send({ message: 'Failed to remove election' });
    }
}


async function getAll(req, res) {
    try {
        let elections;
        
        if (req.user.role === 'voter') elections = electionModel.getAvailableElections();
        else elections = electionModel.getAllElections();

        res.send(elections);
    } catch (err) {
        console.error('Error fetching elections:', err);
        res.status(500).send({ message: 'Failed to get elections' });
    }
}


async function get(req, res) {
    try {
        const { electionId } = req.params;
        
        const election = electionModel.getById(electionId);

        res.send(election);
    } catch (err) {
        console.error(`Error fetching election with ID: ${electionId}:`, err);
        res.status(500).send({ message: 'Failed to get election' });
    }
}


async function results(req, res) {
    try {
        const { electionId } = req.params;

        const results = candidateModel.getVotes(electionId);

        res.send(results);
    } catch (err) {
        console.error('Error retrieving the election results:', err);
        res.status(500).send({ message: 'Failed to get election' });
    }
}


async function vote(req, res) {
    try {
        const { studentId, vote } = req.body;
        const { electionId } = req.params;

        const election = electionModel.getById(electionId);
        if (election?.status !== 'open') return res.status(400).send({ message: 'This election has already ended' });

        const user = userModel.getUser(studentId);
        if (!user) return res.status(400).send({ message: `Invalid ID: ${studentId}`});

        const contracts = await loadContracts();

        try {
            await contracts.electionManager.hasVoted(electionId, user.voter_id);
        } catch (err) {
            return res.status(400).send({ message: `Failed to submit vote: ${getRevertError(err)}` });
        }
        
        const hasVoted = await contracts.electionManager.hasVoted(electionId, user.voter_id);
        if (hasVoted) return res.status(400).send({ message: 'You already voted for this election' });
        
        const tx = await contracts.electionManager.vote(electionId, user.voter_id, ('0x' + vote));
        await tx.wait();

        const uuid = uuidv4();
        transactionModel.addTransaction(uuid, tx.hash, Math.floor(Date.now() / 1000));

        res.send({ uuid: uuid, message: 'Vote submitted' });
    } catch (err) {
        console.error('Error submitting vote:', err);
        res.status(500).send({ message: `Failed to submit vote: ${getRevertError(err)}` });
    }
}


async function voteExists(req, res) {
    try {
        const { uuid } = req.params;

        const transaction = transactionModel.getTransaction(uuid);
        if (!transaction) return res.status(400).send({ message: 'UUID is invalid or does not exists' });

        const tx = await provider.getTransaction(transaction.tx_hash);
        if (!tx) throw new Error('Transaction not found');

        res.send({ message: 'UUID confirmed! Your vote is recorded' });
    } catch (err) {
        console.error('Error confirming vote existence:', err);
        res.status(500).send({ message: 'Failed to confirm vote existence' });
    }
}


module.exports = {
    add,
    setSchedule,
    setStatus,
    remove,
    getAll,
    get,
    results,
    vote,
    voteExists,
}