// Configurable Values
const CONTRACT_NAME = "Cherry";


// Boilerplate
const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const infura_key = fs.readFileSync(__dirname + "/../.infura").toString().trim();

let environment = process.argv[2],
	network_id, endpoint, private_key;

if (environment === 'rinkeby') {
	network_id = '4';
	endpoint = 'https://rinkeby.infura.io/v3/' + infura_key;
	private_key = fs.readFileSync(__dirname + "/../.secret.rinkeby.key").toString().trim();
} else if (environment === 'mainnet') {
	network_id = '1';
	endpoint = 'https://mainnet.infura.io/v3/' + infura_key;
	private_key = fs.readFileSync(__dirname + "/../.secret.mainnet.key").toString().trim();
} else {
	console.error("Invalid environment:", environment);
	process.exit();
}

// Add a test address
let player_private_key = fs.readFileSync(__dirname + "/../.secret.player.key").toString().trim();
const accounts = [private_key, player_private_key];

const contractJsonString = fs.readFileSync(__dirname + "/../build/contracts/" + CONTRACT_NAME + ".json").toString().trim();
const contractJson = JSON.parse(contractJsonString);

const abi = contractJson.abi;
const address = contractJson.networks[network_id].address;

const provider = new HDWalletProvider(accounts, endpoint, 0, accounts.length);
const web3 = new Web3(provider);
const contract = new web3.eth.Contract(abi, address);

async function getOwner() {
	account = await web3.eth.getAccounts();
	return account[0];
}

async function getAccount(idx) {
	account = await web3.eth.getAccounts();
	return account[idx];
}

function consoleEvents(response) {
	console.log("Gas Cost:", response.gasUsed);
	if (response && response.events) {
		for (let eventId in response.events) {
			if (response.events.hasOwnProperty(eventId) && response.events[eventId].event) {
				console.log("Event:", response.events[eventId].event, response.events[eventId].returnValues);
			}
		}
	}
}

module.exports = {
	web3,
	getOwner,
	getAccount,
	address,
	contract,
	consoleEvents
}
