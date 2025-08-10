const user = require('./userModel.js');
const candidate = require('./candidateModel.js');
const election = require('./electionModel.js');
const vote = require('./voteModel.js');

function finalize() {
    user.getUserStmt.finalize();
    user.registerUserStmt.finalize();

    candidate.getAllCandidatesStmt.finalize();
    candidate.insertCandidateStmt.finalize();
    candidate.removeCandidateStmt.finalize();
    candidate.updateCandidateStmt.finalize();

    election.addElectionStmt.finalize();
    election.getElectionsStmt.finalize();
    election.getElectionByIdStmt.finalize();
    election.removeElectionStmt.finalize();
    election.setElectionScheduleStmt.finalize();
    election.setElectionStatusStmt.finalize();
    
    vote.addVoteStmt.finalize();
    vote.getVoteStmt.finalize();
}

module.exports = {
    user,
    candidate,
    election,
    vote,

    finalize
};