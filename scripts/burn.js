const setup = require('./setup.js');

if (process.argv.length < 5) {
	console.error("Missing address and amount:");
	console.error("\tnode burn.js [network] [address] [amount in ether denom (10^18)]");
	process.exit();
}

var addressTo = process.argv[3];
var amount = process.argv[4];

start();

async function start(){
	let owner = await setup.getOwner();
	let web3 = setup.web3;
	let contract = setup.contract;

	if (owner.toLowerCase() !== addressTo.toLowerCase()) {
		console.error("Owner is not provided address:", owner, addressTo);
	} else {
		console.log("Addresses match:", owner, addressTo);
	}

	let response = await contract.methods.burn(
		web3.utils.toWei(String(amount), "ether")
	).send({from: addressTo});

	setup.consoleEvents(response);

	process.exit();
}
