const user = require('./userModel.js');
const candidate = require('./candidateModel.js');
const election = require('./electionModel.js');
const authCode = require('./authCodeModel.js');


function finalize() {
    user.getUserStmt.finalize();
    user.registerUserStmt.finalize();
    user.updatePasswordStmt.finalize();
    user.toggle2FAStmt.finalize();

    candidate.getAllCandidatesStmt.finalize();
    candidate.insertCandidateStmt.finalize();
    candidate.removeCandidateStmt.finalize();
    candidate.updateCandidateStmt.finalize();

    election.addElectionStmt.finalize();
    election.setElectionScheduleStmt.finalize();
    election.setElectionStatusStmt.finalize();
    election.removeElectionStmt.finalize();
    election.getElectionsStmt.finalize();
    election.getAvailableElectionsStmt.finalize();
    election.getByIdStmt.finalize();

    authCode.addCodeStmt.finalize();
    authCode.isCodeSentStmt.finalize();
    authCode.isCodeValid.finalize();
}

module.exports = {
    user,
    candidate,
    election,

    finalize
};