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
    WHERE status != 'draft'
    ORDER BY
        CASE status
            WHEN 'open' THEN 1
            WHEN 'scheduled' THEN 2
            WHEN 'closed' THEN 3
        END,

        CASE
            WHEN status = 'open' THEN end_time
            WHEN status = 'scheduled' THEN start_time
        END ASC,

        CASE
            WHEN status = 'closed' THEN end_time
        END DESC;
`);

const getByIdStmt = db.prepare(`
    SELECT * FROM elections
    WHERE id = ?
`);


function addElection(id, title) {
    return addElectionStmt.run(id, title);
}


function setElectionSchedule(id, startTime, endTime) {
    return setElectionScheduleStmt.run(startTime, endTime, id);
}


function setElectionStatus(id, status) {
    return setElectionStatusStmt.run(status, id);
}


function removeElection(id) {
    return removeElectionStmt.run(id);
}


function getAllElections() {
    return getElectionsStmt.all() || [];
}


function getAvailableElections() {
    return getAvailableElectionsStmt.all() || [];
}


function getById(id) {
    return getByIdStmt.get(id);
}


module.exports = {
    addElection,
    setElectionSchedule,
    setElectionStatus,
    removeElection,
    getAllElections,
    getAvailableElections,
    getById,
};