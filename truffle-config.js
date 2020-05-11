const fs = require('fs');
const HDWalletProvider = require('truffle-hdwallet-provider');

//const infura_key = fs.readFileSync(__dirname + "/.infura").toString().trim();
//const rinkeby_private_key = fs.readFileSync(__dirname + "/.secret.rinkeby.key").toString().trim();
//const mainnet_private_key = fs.readFileSync(__dirname + "/.secret.mainnet.key").toString().trim();

const infura_key = "";
const rinkeby_private_key = "";
const mainnet_private_key = "";

module.exports = {
  networks: {
    rinkeby: {
      provider: () => new HDWalletProvider(
        rinkeby_private_key,
        'https://rinkeby.infura.io/v3/' + infura_key
      ),
      gas: 6721975,
      gasPrice: 10000000000, // 10 gwei
      network_id: '4'
    },

    mainnet: {
      provider: () => new HDWalletProvider(
        mainnet_private_key,
        'https://mainnet.infura.io/v3/' + infura_key
      ),
      gas: 6721975,
      gasPrice: 10000000000, // 10 gwei
      network_id: '1'
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.6",
    }
  }
}
