const voteModel = require('../models/voteModel.js');
const { v4: uuidv4 } = require('uuid');


async function add(req, res) {
    try {
        const { electionId, votes } = req.body;

        const uuid = uuidv4();
        const timestamp = Math.floor(Date.now() / 1000);

        await voteModel.addVote(uuid, votes, timestamp, electionId);

        res.send({ message: 'Vote added successfully' });
    } catch (err) {
        console.error('Adding vote error:', err);
        res.status(500).send({ message: 'Failed to add vote' });
    }
}


async function get(req, res) {
    try {
        const { uuid } = req.body;

        const votes = await voteModel.getVote(uuid);

        res.send(votes);
    } catch (err) {
        console.error('Retrieving votes error:', err);
        res.status(500).send({ message: 'Failed to retrieve votes' });
    }
}


module.exports = { add, get };