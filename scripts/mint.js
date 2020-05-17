const setup = require('./setup.js');

if (process.argv.length < 5) {
	console.error("Missing address and amount:");
	console.error("\tnode mint.js [network] [address] [amount in ether denom (10^18)]");
	process.exit();
}

var addressTo = process.argv[3];
var amount = process.argv[4];

start();

async function start(){
	let owner = await setup.getOwner();
	let web3 = setup.web3;
	let contract = setup.contract;

	let response = await contract.methods.mint(
		addressTo,
		web3.utils.toWei(web3.utils.toBN(amount), "ether")
	).send({from: owner});

	setup.consoleEvents(response);

	process.exit();
}
