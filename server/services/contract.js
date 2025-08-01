const ethers = require('ethers');
const path = require('path');
const fs = require('fs');

require('dotenv').config();

const contractsPaths = path.resolve(__dirname, '../../blockchain/smart_contracts');
const keysPath = path.resolve(contractsPaths, 'scripts/keys');

let contracts = null;

async function loadContracts() {
    if (contracts) return contracts;

    const contractEnvVars = [
        'ADMIN_MANAGER_ADDRESS',
        'VOTER_MANAGER_ADDRESS',
        'ELECTION_MANAGER_ADDRESS',
        'VOTING_ADDRESS',
    ];
    for (const v of contractEnvVars) {
        if (!process.env[v]) {
            throw new Error(`Missing environment variable: ${v}`);
        }
    }
    
    let accounts, quorum;
    try {
        ({ accounts, quorum } = require(keysPath));
    } catch (err) {
        throw new Error(`Error loading keys file at ${keysPath}: ${err.message}`);
    }
    
    const host = quorum?.rpcnode?.url;
    if (!host) throw new Error('RPC node URL missing in quorum config');

    const privateKey = accounts?.a?.privateKey;
    if (!privateKey) throw new Error('Private key missing in account config');
    

    const provider = new ethers.JsonRpcProvider(host);
    try {
        await provider.getNetwork();
    } catch (err) {
        throw new Error(`Failed to connect to provider at ${host}: ${err.message}`);
    }
    const wallet = new ethers.Wallet(privateKey, provider);
    

    function loadJson(filePath) {
        try {
            const content = fs.readFileSync(filePath);
            return JSON.parse(content);
        } catch (err) {
            throw new Error(`Failed to read or parse ABI file ${filePath}: ${err.message}`);
        }
    }
    
    const artifacts = {
        adminManager: path.resolve(contractsPaths, 'artifacts/AdminManager.json'),
        voterManager: path.resolve(contractsPaths, 'artifacts/VoterManager.json'),
        electionManager: path.resolve(contractsPaths, 'artifacts/ElectionManager.json'),
        voting: path.resolve(contractsPaths, 'artifacts/Voting.json'),
    };
    
    const json = {
        adminManager: loadJson(artifacts.adminManager),
        voterManager: loadJson(artifacts.voterManager),
        electionManager: loadJson(artifacts.electionManager),
        voting: loadJson(artifacts.voting),
    };
    
    const abi = {
        adminManager: json.adminManager.abi,
        voterManager: json.voterManager.abi,
        electionManager: json.electionManager.abi,
        voting: json.voting.abi,
    };
    
    contracts = {
        adminManager: new ethers.Contract(process.env.ADMIN_MANAGER_ADDRESS, abi.adminManager, wallet),
        voterManager: new ethers.Contract(process.env.VOTER_MANAGER_ADDRESS, abi.voterManager, wallet),
        electionManager: new ethers.Contract(process.env.ELECTION_MANAGER_ADDRESS, abi.electionManager, wallet),
        voting: new ethers.Contract(process.env.VOTING_ADDRESS, abi.voting, wallet)
    };

    return contracts;
}


module.exports = { loadContracts };