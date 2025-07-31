const logModel = require('../models/logModel.js');


async function add(req, res) {
    try {
        const { action, timestamp, txHash } = req.body;

        await logModel.addLog(action, timestamp, txHash);

        res.send({ message: 'Log added successfully' });
    } catch (err) {
        console.error('Error adding log:', err);
        res.status(500).send({ message: 'Failed to add log' });
    }
}


module.exports = { add };