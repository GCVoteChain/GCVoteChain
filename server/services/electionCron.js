require('dotenv').config();


const cron = require('node-cron');
const eccrypto = require('eccrypto');

const db = require('../data/db');
const candidateModel = require('../models/candidateModel');



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

  // Open elections
  const scheduledElections = db.prepare(`
    SELECT id FROM elections
    WHERE status = 'scheduled' AND start_time <= ? AND end_time > ?
  `).all(now, now);

  for (const { id } of scheduledElections) {
    try {
      // const tx = await contracts.electionManager.startElection(id);
      // await tx.wait();

      db.prepare(`UPDATE elections SET status = 'open' WHERE id = ?`).run(id);
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
      // const txStop = await contracts.electionManager.stopElection(id);
      // await txStop.wait();

      db.prepare(`UPDATE elections SET status = 'closed' WHERE id = ?`).run(id);

      const rows = db.prepare(`
        SELECT encrypted_vote FROM votes
        WHERE election_id = ?
      `).all(id);

      for (const row of rows) {
        const buffer = splitBuffer(Buffer.from(row.encrypted_vote, 'hex'));
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