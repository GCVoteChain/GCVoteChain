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
    ORDER BY
        CASE status
            WHEN 'draft' THEN 1
            WHEN 'open' THEN 2
            WHEN 'scheduled' THEN 3
            WHEN 'closed' THEN 4
        END,

        CASE
            WHEN status = 'open' THEN end_time
            WHEN status = 'scheduled' THEN start_time
        END ASC,

        CASE
            WHEN status = 'closed' THEN end_time
        END DESC;
`);

const getAvailableElectionsStmt = db.prepare(`
    SELECT * FROM elections
    WHERE id = ? AND status != 'draft'
    ORDER BY
        CASE status
            WHEN 'open' THEN 1
            WHEN 'scheduled' THEN 2
        END,
        CASE
            WHEN status = 'open' THEN end_time
            WHEN status = 'scheduled' THEN start_time
        END ASC;
`);


const addAsync = promisify(addElectionStmt.run.bind(addElectionStmt));
const setScheduleAsync = promisify(setElectionScheduleStmt.run.bind(setElectionScheduleStmt));
const setStatusAsync = promisify(setElectionStatusStmt.run.bind(setElectionStatusStmt));
const removeAsync = promisify(removeElectionStmt.run.bind(removeElectionStmt));
const getAllAsync = promisify(getElectionsStmt.all.bind(getElectionsStmt));
const getAvailableElectionsAsync = promisify(getAvailableElectionsStmt.all.bind(getAvailableElectionsStmt));


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


async function getAvailableElections() {
    return getAvailableElectionsAsync() || [];
}


module.exports = {
    addElectionStmt,
    setElectionScheduleStmt,
    setElectionStatusStmt,
    removeElectionStmt,
    getElectionsStmt,
    getAvailableElectionsStmt,

    addElection,
    setElectionSchedule,
    setElectionStatus,
    removeElection,
    getAllElections,
    getAvailableElections,
};