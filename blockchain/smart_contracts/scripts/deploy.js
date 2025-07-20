const path = require('path');
const fs = require('fs');
const ethers = require('ethers');

const { quorum } = require('./keys.js');
const host = quorum.rpcnode.url;
const privateKey = quorum.rpcnode.accountPrivateKey;


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

    const adminManagerPath = path.resolve(__dirname, '../contracts', 'AdminManager.sol');
    const voterManagerPath = path.resolve(__dirname, '../contracts', 'VoterManager.sol');
    const electionManagerPath = path.resolve(__dirname, '../contracts', 'ElectionManager.sol');
    const votingPath = path.resolve(__dirname, '../contracts', 'Voting.json');

    let env = '';

    createContract(adminManagerPath, wallet).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `ADMIN_MANAGER_ADDRESS=${contractAddress}`;
    }).catch(console.error);

    createContract(voterManagerPath, wallet).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `VOTER_MANAGER_ADDRESS=${contractAddress}`;
    }).catch(console.error);

    createContract(electionManagerPath, wallet).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `ELECTION_MANAGER_ADDRESS=${contractAddress}`;
    }).catch(console.error);

    createContract(votingPath, wallet).then(async function(contract) {
        const contractAddress = await contract.getAddress();
        env += `VOTING_ADDRESS=${contractAddress}`;
    }).catch(console.error);

    fs.writeFileSync(path.resolve(__dirname, '../../../server', '.env'), env);
})();