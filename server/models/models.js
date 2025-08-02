const user = require('./userModel.js');
const candidate = require('./candidateModel.js');
const election = require('./electionModel.js');
const log = require('./logModel.js');
const transaction = require('./transactionModel.js');
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
    election.removeElectionStmt.finalize();
    election.setElectionScheduleStmt.finalize();
    election.setElectionStatusStmt.finalize();

    log.addLogStmt.finalize();
    
    transaction.addTransactionStmt.finalize();
    transaction.setTransactionStatusStmt.finalize();
    transaction.getTransactionStmt.finalize();
    
    vote.addVoteStmt.finalize();
    vote.getVoteStmt.finalize();
}

module.exports = {
    user,
    candidate,
    election,
    log,
    transaction,
    vote,

    finalize
};