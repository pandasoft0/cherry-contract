const setup = require('../scripts/setup.js');

if (process.argv.length < 4) {
	console.error("Missing filename:");
	console.error("\tnode airdrop.js [network] [filename.json]");
	process.exit();
}

const fs = require('fs');
const airdropJsonFilename = __dirname + "/" + process.argv[3];

// Initiate the airdrop based on remaining addresses
var airdropJsonFile = fs.readFileSync(airdropJsonFilename).toString('utf-8');
var airdropJson = JSON.parse(airdropJsonFile);

airdrop();

// Configuration
const MAX_ITER = 20;
const MAX_PER_BATCH = 50;

// These are used in multiple functions
var owner, web3, contract, nonce;

async function airdrop() {
	// Set up the required values
	owner = await setup.getOwner();
	web3 = setup.web3;
	contract = setup.contract;
	nonce = await web3.eth.getTransactionCount(owner, 'pending');

	let recipients = [], amounts = [];
	let iter = 0;
	for (let i = 0; i < airdropJson.length; i++) {
		let to_address  = airdropJson[i]['address'];
		let amount      = airdropJson[i]['amount'];
		let in_progress = airdropJson[i]['in_progress'];
		let completed   = airdropJson[i]['completed'];

		if (to_address.length !== 42 || to_address.indexOf('0x') !== 0) {
			console.error("Invalid to_address: " + String(to_address));
			continue;
		}

		if (in_progress && !completed) {
			throw "In progress: " + String(to_address) + " - please manually review";
		}

		if (!in_progress && !completed) {
			// Update the file
			airdropJson[i]['in_progress'] = 1;
			let data = JSON.stringify(airdropJson);
			fs.writeFileSync(airdropJsonFilename, data);

			//let code = await web3.eth.getCode(to_address);
			let code = '0x';
			if (code === '0x') {
				// Issue the tx
				if (iter >= MAX_ITER - 1 || i >= (airdropJson.length - 1)) {
					if (recipients.length < MAX_PER_BATCH) {
						recipients.push(to_address);
						amounts.push(web3.utils.toWei(String(amount), "ether"));
					}

					if (recipients.length == MAX_PER_BATCH || i >= (airdropJson.length - 1)) {
						iter = 0;

						console.log(" * On tx " + String(Math.floor(i/MAX_PER_BATCH)) + " of " + String(Math.ceil(airdropJson.length/MAX_PER_BATCH)) + ", Minting to " + recipients);
						let response = await mint(recipients, amounts);
						setup.consoleEvents(response);

						recipients = [];
						amounts = [];
					}
				} else {
					if (recipients.length < MAX_PER_BATCH) {
						recipients.push(to_address);
						amounts.push(web3.utils.toWei(String(amount), "ether"));
					} else {
						iter++;
						console.log("On tx " + String(Math.floor(i/MAX_PER_BATCH)) + " of " + String(Math.ceil(airdropJson.length/MAX_PER_BATCH)) + ", Minting to " + recipients);
						mint(recipients, amounts);
						recipients = [];
						amounts = [];
					}
				}
			}

			// Update the file
			airdropJson[i]['completed'] = 1;
			data = JSON.stringify(airdropJson);
			fs.writeFileSync(airdropJsonFilename, data);
		} else {
			console.log("Skipping " + to_address + " - already completed for " + amount);
		}
	}

	process.exit();
}

async function mint(recipients, amounts){
	return await contract.methods.batchMint(
		recipients,
		amounts
	).send({from: owner, "gasPrice": web3.utils.toWei("2.1", "gwei"), "nonce" : nonce++});
}
