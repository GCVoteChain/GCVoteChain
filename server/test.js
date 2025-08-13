const bcrypt = require('bcryptjs');
const { keccak256, solidityPacked } = require('ethers');


async function createUsers() {
//   const addStmt = db.prepare(`
//     INSERT INTO users (voter_id, student_id, password, name, email, role)
//     VALUES (?, ?, ?, ?, ?, ?)
//   `);

//   for (let i = 0; i < 100; i++ ) {
//     try {
//       const username = `user${i + 1}`;
      
//       const exists = getBuiltinModule.getUser(username);
//       if (exists) continue;

//       const hashedPassword = await bcrypt.hash('user123', 10);
//       const voterId = keccak256(solidityPacked(['string', 'string'], [username, 'voter']));

//       userModel.registerUser(voterId, username, hashedPassword, username, '', 'voter');
//     } catch (err) {
//       console.error('Failed to initialize voter:', voter);
//     }
//   }
    console.log('asd');
}

function createCandidates() {
  const POSITIONS = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Auditor',
    'PRO'
  ];

  POSITIONS.forEach((position, index) => {
    for (let i = 0; i < 3; i++) {
      
    }
  })
}