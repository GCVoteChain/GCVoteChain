const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const contractsPath = path.resolve(__dirname, '../', 'contracts');
const interfacesPath = path.resolve(contractsPath, 'utils');

function buildSources() {
  const sources = {};
  const contractsFiles = fs.readdirSync(contractsPath);
  contractsFiles.forEach(file => {
    if(file.endsWith(".sol")){
      const contractFullPath = path.resolve(contractsPath, file);
	  const relativePath = `./${path.relative(contractsPath, contractFullPath).replace('/\\/g', '/')}`
      sources[relativePath] = {
        content: fs.readFileSync(contractFullPath, 'utf8')
      };
    }
  });

  const interfacesFiles = fs.readdirSync(interfacesPath);
  interfacesFiles.forEach(file => {
	if (file.endsWith('.sol')) {
	  const interfaceFullPath = path.resolve(interfacesPath, file);
	  const relativePath = `./${path.relative(contractsPath, interfaceFullPath).replace('/\\/g', '/')}`
	  sources[relativePath] = {
		content: fs.readFileSync(interfaceFullPath, 'utf8')
	  };
	}
  })

  return sources;
}

const input = {
	language: 'Solidity',
	sources: buildSources(),
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*', 'evm.bytecode'  ]
			}
		}
	}
}

function compileContracts() {
  const stringifiedJson = JSON.stringify(input);
  const compilationResult = solc.compile(stringifiedJson);
  const output = JSON.parse(compilationResult);

  const buildPath = path.resolve(__dirname, '../', 'artifacts');
  fs.removeSync(buildPath);
  fs.ensureDirSync(buildPath);
  
	const compiledContracts = output.contracts;
	for (let contract in compiledContracts) {
		for(let contractName in compiledContracts[contract]) {
			fs.outputJsonSync(
				path.resolve(buildPath, `${contractName}.json`),
				compiledContracts[contract][contractName], { spaces: 2 }
			)
		}
	}
}

const main = () => {
	compileContracts();
}

if (require.main === module) {
  main();
}

module.exports = exports = main


