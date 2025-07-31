const transactionModel = require('../models/transactionModel.js');


async function add(req, res) {
    try {
        const { txHash, status, voterId } = req.body;

        await transactionModel.addTransaction(txHash, status, voterId);

        res.send({ message: 'Transaction added successfully' });
    } catch (err) {
        console.error('Error adding transaction:', err);
        res.status(500).send({ message: 'Failed to add transaction' });
    }
}


async function setStatus(req, res) {
    try {
        const { txHash, status } = req.body;

        await transactionModel.setTransactionStatus(txHash, status);

        res.send({ message: 'Transaction status updated successfully' });
    } catch (err) {
        console.error('Error updating transaction status:', err);
        res.status(500).send({ message: 'Failed to set transaction status' });
    }
}


async function get(req, res) {
    try {
        const { txHash } = req.body;

        const tx = await transactionModel.getTransaction(txHash);

        res.send(tx);
    } catch (err) {
        console.error('Error fetching transaction', err);
        res.status(500).send({ message: 'Failed to retrieve transaction' });
    }
}


module.exports = { add, setStatus, get };