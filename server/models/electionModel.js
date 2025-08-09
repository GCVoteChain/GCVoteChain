const db = require('../data/db')
const { promisify } = require('util');

const addElectionStmt = db.prepare(`
    INSERT INTO elections (id, title)
    VALUES (?, ?)
`);

const setElectionScheduleStmt = db.prepare(`
    UPDATE elections
    SET status = 'scheduled', start_time = ?, end_time = ?
    WHERE id = ?
`);

const setElectionStatusStmt = db.prepare(`
    UPDATE elections
    SET status = ?
    WHERE id = ?
`);

const removeElectionStmt = db.prepare(`
    DELETE FROM elections
    where id = ?
`);

const getElectionsStmt = db.prepare(`
    SELECT * FROM elections
`);

const getElectionByIdStmt = db.prepare(`
    SELECT * FROM elections
    WHERE id = ?
`);


const addAsync = promisify(addElectionStmt.run.bind(addElectionStmt));
const setScheduleAsync = promisify(setElectionScheduleStmt.run.bind(setElectionScheduleStmt));
const setStatusAsync = promisify(setElectionStatusStmt.run.bind(setElectionStatusStmt));
const removeAsync = promisify(removeElectionStmt.run.bind(removeElectionStmt));
const getAllAsync = promisify(getElectionsStmt.all.bind(getElectionsStmt));
const getByIdAsync = promisify(getElectionsStmt.get.bind(getElectionsStmt));


async function addElection(id, title) {
    return addAsync(id, title);
}


async function setElectionSchedule(id, startTime, endTime) {
    return setScheduleAsync(startTime, endTime, id);
}


async function setElectionStatus(id, status) {
    return setStatusAsync(status, id);
}


async function removeElection(id) {
    return removeAsync(id);
}


async function getAllElections() {
    return getAllAsync() || [];
}


async function getById(id) {
    return getByIdAsync(id);
}


module.exports = {
    addElectionStmt,
    setElectionScheduleStmt,
    setElectionStatusStmt,
    removeElectionStmt,
    getElectionsStmt,
    getElectionByIdStmt,

    addElection,
    setElectionSchedule,
    setElectionStatus,
    removeElection,
    getAllElections,
    getById,
};