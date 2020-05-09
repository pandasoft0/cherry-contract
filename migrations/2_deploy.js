const Cherry = artifacts.require('./Cherry.sol');

const name   = "Cherry";
const symbol = "CHERRY";

// eslint-disable-next-line func-names
module.exports = async (deployer) => {
	// Deploy the contract
	await deployer.deploy(Cherry, name, symbol);

	// Set original values
	const instance = await Cherry.deployed();
	/*
	await instance.setPurchaseOptions(
		initialConfig.optionCount,
		initialConfig.optionValues,
		initialConfig.optionPrices
	);
	*/
};
