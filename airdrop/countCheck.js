if (process.argv.length < 3) {
	console.error("Missing filename:");
	console.error("\tnode countCheck.js [filename.json]");
	process.exit();
}

const fs = require('fs');
const airdropJsonFilename = __dirname + "/" + process.argv[2];

// Initiate the airdrop based on remaining addresses
var airdropJsonFile = fs.readFileSync(airdropJsonFilename).toString('utf-8');
var airdropJson = JSON.parse(airdropJsonFile);

count();


async function count() {
	let total = 0;
	for (let i = 0; i < airdropJson.length; i++) {
		//let to_address  = airdropJson[i]['address'];
		let amount = Number(airdropJson[i]['amount']);
		total += amount;
	}

	console.log("Number of recipients:", airdropJson.length);
	console.log("Total amount:", total);

	process.exit();
}
