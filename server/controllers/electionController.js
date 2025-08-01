const { keccak256, solidityPacked } = require('ethers');
const electionModel = require('../models/electionModel.js');


async function add(req, res) {
    try {
        const { title } = req.body;
        const timestamp = Math.floor(Date.now() / 1000);
        const id = keccak256(solidityPacked(['string', 'uint256'], [title, timestamp]));

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

        await electionModel.setElectionSchedule(id, startTime, endTime);

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


module.exports = {
    add,
    setSchedule,
    setStatus,
    remove,
    getAll
}