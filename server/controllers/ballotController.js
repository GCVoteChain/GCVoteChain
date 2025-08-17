const electionModel = require('../models/electionModel');
const ballotModel = require('../models/ballotModel');


async function get(req, res) {
    try {
        const { electionId } = req.params;
        if (!electionId) {
            return res.status(400).send({ message: 'Missing election ID' });
        }
        
        const election = electionModel.getById(electionId);
        if (!election) {
            return res.status(400).send({ message: 'Invalid election ID' });
        }

        const currentTime = Date.now();

        if (election.end_time > currentTime && election.status !== 'closed') {
            return res.status(400).send({ message: `Error: Election (${electionId}) is still ongoing`});
        }

        const ballots = ballotModel.getAll(electionId).map(ballot => {
            return {
                ...ballot,
                votes: JSON.parse(ballot.votes)
            };
        });

        res.send({ title: election.title, ballots: ballots });
    } catch (err) {

    }
}


module.exports = { get };