const candidateModel = require('../models/candidateModel.js');
const { keccak256, solidityPacked } = require('ethers');


async function add(req, res) {
    try {
        const { studentId, electionId, name, position } = req.body;

        const candidateId = keccak256(solidityPacked(['string', 'string', 'string'], [electionId, studentId, position]));

        candidateModel.addCandidate(candidateId, studentId, electionId, name, position);

        res.send({ message: 'Candidate added successfully' });
    } catch (err) {
        console.error('Error adding candidate:', err);
        res.status(500).send({ message: 'Failed to add candidate' });
    }
}


async function update(req, res) {
    try {
        const { studentId, electionId, name, position } = req.body;

        candidateModel.updateCandidate(electionId, studentId, name, position);

        res.send({ message: 'Candidate updated successfully' });
    } catch (err) {
        console.error('Error updating candidate:', err);
        res.status(500).send({ message: 'Failed to update candidate' });
    }
}


async function remove(req, res) {
    try {
        const { electionId, studentId } = req.body;
        if (!electionId || !studentId) {
            return res.status(400).send({ message: 'Invalid or missing Election ID and/or Student ID.\n\nPlease refresh the page.'})
        }

        candidateModel.removeCandidate(electionId, studentId);

        res.send({ message: 'Candidate removed successfully' });
    } catch (err) {
        console.error('Error removing candidate:', err);
        res.status(500).send({ message: 'Failed to remove candidate' });
    }
}


async function get(req, res) {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).send({ message: 'Missing election ID'});
        }

        const candidates = candidateModel.getAllCandidates(electionId);

        res.send(candidates);
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).send({ message: 'Failed to retrieve candidates' });
    }
}


module.exports = {
    add,
    update,
    remove,
    get
}