const { keccak256, solidityPacked } = require('ethers');
const electionModel = require('../models/electionModel.js');
// const { loadContracts } = require('../services/contract.js');


async function add(req, res) {
    try {
        const { title } = req.body;
        const timestamp = Math.floor(Date.now() / 1000);
        const id = keccak256(solidityPacked(['string', 'uint256'], [title, timestamp]));

        // const contracts = await loadContracts();

        // const tx = await contracts.electionManager.createElection(id, title);
        // await tx.wait();

        await electionModel.addElection(id, title);

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

        const now = Math.floor(new Date().getTime() / 1000);
        
        if (start > end) return res.status(400).send({ message: 'Start time must be before the end time' });
        if (start < now) return res.status(400).send({ message: 'Start time must be in the future' });

        const contracts = await loadContracts();

        const tx = await contracts.electionManager.setElectionSchedule(id, start, end);
        await tx.wait();

        await electionModel.setElectionSchedule(id, start, end);

        res.send({ message: 'Election scheduled successfully' });
    } catch (err) {
        console.error('Error updating election schedule:', err);
        res.status(500).send({ message: 'Failed to update election schedule' });
    }
}


async function setStatus(req, res) {
    try {
        const { id, status } = req.body;

        await electionModel.setElectionStatus(id, status);

        res.send({ message: 'Election status updated successfully' });
    } catch (err) {
        console.error('Error updating election status:', err);
        res.status(500).send({ message: 'Failed to update election status' });
    }
}


async function remove(req, res) {
    try {
        const { id } = req.body;

        // const contracts = await loadContracts();

        // const tx = await contracts.electionManager.removeElection(id);
        // await tx.wait();

        await electionModel.addElection(id, title);

        res.send({ message: 'Election added successfully' });
    } catch (err) {
        console.error('Error removing election:', err);
        res.status(500).send({ message: 'Failed to remove election' });
    }
}


async function getAll(req, res) {
    try {
        const elections = await electionModel.getAllElections();

        res.send(elections);
    } catch (err) {
        console.error('Error fetching elections:', err);
        res.status(500).send({ message: 'Failed to get elections' });
    }
}


async function get(req, res) {
    try {
        const { id } = req.params;
        
        const election = await electionModel.getById(id);

        res.send(election);
    } catch (err) {
        console.error(`Error fetching election with ID: ${id}:`, err);
        res.status(500).send({ message: 'Failed to get election' });
    }
}


module.exports = {
    add,
    setSchedule,
    setStatus,
    remove,
    getAll,
    get
}