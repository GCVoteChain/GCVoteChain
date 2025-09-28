const userModel = require('../models/userModel.js');
const candidateModel = require('../models/candidateModel.js');
const electionModel = require('../models/electionModel.js');
const { keccak256, solidityPacked } = require('ethers');

const { loadContracts, getRevertError } = require('../services/contract.js');


async function add(req, res) {
    try {
        const { studentId, electionId, name, position } = req.body;

        const selectedElection = electionModel.getById(electionId);
        if (!selectedElection) return res.send({ message: `Invalid election ID: ${electionId}`});

        if (selectedElection.status !== 'draft') return res.send({ message: 'This action is not permitted. Candidate changes are only allowed during the draft stage.'});

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

        const selectedElection = electionModel.getById(electionId);
        if (!selectedElection) return res.send({ message: `Invalid election ID: ${electionId}`});

        if (selectedElection.status !== 'draft') return res.send({ message: 'This action is not permitted. Candidate changes are only allowed during the draft stage.'});

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

        const selectedElection = electionModel.getById(electionId);
        if (!selectedElection) return res.send({ message: `Invalid election ID: ${electionId}`});

        if (selectedElection.status !== 'draft') return res.send({ message: 'This action is not permitted. Candidate changes are only allowed during the draft stage.'});

        candidateModel.removeCandidate(electionId, studentId);

        res.send({ message: 'Candidate removed successfully' });
    } catch (err) {
        console.error('Error removing candidate:', err);
        res.status(500).send({ message: 'Failed to remove candidate' });
    }
}


async function getPreview(req, res) {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).send({ message: 'Missing election ID'});
        }
        
        const candidates = candidateModel.getAllCandidates(electionId);
        
        if (req.user.role === 'admin') return res.send({ candidates });

        const user = userModel.getUser(req.user.student_id);
        if (!user) return res.status(400).send({ message: `Invalid ID: ${req.user.student_id}`});

        const contracts = await loadContracts();

        try {
            await contracts.electionManager.hasVoted(electionId, user.voter_id);
        } catch (err) {
            return res.status(400).send({ message: `Failed to submit vote: ${getRevertError(err)}` });
        }

        const hasVoted = await contracts.electionManager.hasVoted(electionId, user.voter_id);

        res.send({ hasVoted, candidates });
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).send({ message: 'Failed to retrieve candidates' });
    }
}


async function get(req, res) {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).send({ message: 'Missing election ID'});
        }

        const contracts = await loadContracts();

        const user = userModel.getUser(req.user.student_id);

        try {
            await contracts.electionManager.hasVoted(electionId, user.voter_id);
        } catch (err) {
            return res.status(400).send({ message: `Failed to submit vote: ${getRevertError(err)}` });
        }

        const hasVoted = await contracts.electionManager.hasVoted(electionId, user.voter_id);
        if (hasVoted) return res.send({ hasVoted: hasVoted, candidates: [] });

        const candidates = candidateModel.getAllCandidates(electionId);

        res.send({ hasVoted, candidates });
    } catch (err) {
        console.error('Error fetching candidates:', err);
        res.status(500).send({ message: 'Failed to retrieve candidates' });
    }
}


module.exports = {
    add,
    update,
    remove,
    getPreview,
    get
}