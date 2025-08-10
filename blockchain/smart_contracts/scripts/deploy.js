const path = require('path');
const fs = require('fs');
const ethers = require('ethers');

const { accounts, quorum } = require('./keys.js');
const host = quorum.rpcnode.url;
const privateKey = quorum.rpcnode.accountPrivateKey;

const backend = accounts.a;

async function createContract(contractPath, wallet, ...args) {
    const contractJson = JSON.parse(fs.readFileSync(contractPath));
    const abi = contractJson.abi;
    const bytecode = contractJson.evm.bytecode.object;

    const factory = new ethers.ContractFactory(abi, bytecode, wallet);
    const contract = await factory.deploy(...args);

    await contract.waitForDeployment();

    return contract;
}


(async function main() {
    const provider = new ethers.JsonRpcProvider(host);
    const wallet = new ethers.Wallet(privateKey, provider);

    const adminIds = [
        accounts.a.address,
        accounts.b.address,
        accounts.c.address,
    ];

    const adminManagerPath = path.resolve(__dirname, '../artifacts', 'AdminManager.json');
    const voterManagerPath = path.resolve(__dirname, '../artifacts', 'VoterManager.json');
    const electionManagerPath = path.resolve(__dirname, '../artifacts', 'ElectionManager.json');
    const votingPath = path.resolve(__dirname, '../artifacts', 'Voting.json');

    let env = '';

    const adminManagerAddress = await createContract(adminManagerPath, wallet, adminIds).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `ADMIN_MANAGER_ADDRESS=${contractAddress}\n`;
        return contractAddress;
    }).catch(console.error);

    const voterManagerAddress = await createContract(voterManagerPath, wallet, adminManagerAddress).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `VOTER_MANAGER_ADDRESS=${contractAddress}\n`;
        return contractAddress;
    }).catch(console.error);

    const electionManagerAddress = await createContract(electionManagerPath, wallet, adminManagerAddress, voterManagerAddress).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `ELECTION_MANAGER_ADDRESS=${contractAddress}\n`;
        return contractAddress;
    }).catch(console.error);

    const votingAddress = await createContract(votingPath, wallet, backend.address, electionManagerAddress, voterManagerAddress).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `VOTING_ADDRESS=${contractAddress}\n`;
        return contractAddress;
    }).catch(console.error);

    fs.writeFileSync(path.resolve(__dirname, '../../../server', '.env'), env);
})();