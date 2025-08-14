require('dotenv').config();


const cron = require('node-cron');
const eccrypto = require('eccrypto');

const db = require('../data/db');
const candidateModel = require('../models/candidateModel');
const electionModel = require('../models/electionModel');

const { loadContracts } = require('../services/contract.js');

function splitBuffer(buffer) {
  return {
    iv: buffer.slice(0, 16),
    ephemPublicKey: buffer.slice(16, 81),
    ciphertext: buffer.slice(81, buffer.length - 32),
    mac: buffer.slice(buffer.length - 32)
  };
}


cron.schedule('*/5 * * * * *', async () => {
  const now = Math.floor(Date.now() / 1000);

  const contracts = await loadContracts();

  // Open elections
  const scheduledElections = db.prepare(`
    SELECT id FROM elections
    WHERE status = 'scheduled' AND start_time <= ? AND end_time > ?
  `).all(now, now);

  for (const { id } of scheduledElections) {
    try {
      const tx = await contracts.electionManager.startElection(id);
      await tx.wait();
      
      electionModel.setElectionStatus(id, 'open');
    } catch (error) {
      console.error(`Failed to start election ${id}:`, error);
    }
  }

  
  // Close elections
  const openElections = db.prepare(`
    SELECT id FROM elections
    WHERE status = 'open' AND end_time <= ?
  `).all(now);

  for (const { id } of openElections) {
    try {
      const txStop = await contracts.electionManager.stopElection(id);
      await txStop.wait();

      electionModel.setElectionStatus(id, 'closed');

      const encryptedVotes = await contracts.electionManager.getEncryptedVotes(id);

      for (const encrypted of encryptedVotes) {
        const hexStr = encrypted.startsWith('0x') ? encrypted.slice(2) : encrypted;
        
        const buffer = splitBuffer(Buffer.from(hexStr, 'hex'));
        const privateKey = Buffer.from(process.env.CRYPTO_PRIVATE_KEY, 'hex');
        const decrypted = await eccrypto.decrypt(privateKey, buffer);

        const vote = JSON.parse(decrypted.toString());

        Object.keys(vote).forEach(pos => {
          candidateModel.incrementVote(id, vote[pos], pos);
        });
      }
    } catch (error) {
      console.error(`Failed to end election ${id}:`, error);
    }
  }
});