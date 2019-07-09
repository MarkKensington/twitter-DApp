
// ##### Only required for Rinkeby deployment ####
var HDWalletProvider = require("truffle-hdwallet-provider");
var privateKey = "<your private key here>";
var rinkebyEndpoint = "https://rinkeby.infura.io/v3/<YOUR-PROJECT-ID>";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: () => new HDWalletProvider(privateKey, rinkebyEndpoint),
      gasPrice: 50000000000, // 50 gwei,
      gas: 4600000,
      network_id: 4,
    },
  },
  solc: {
    version: "0.5.0",    // Fetch exact version from solc-bin (default: truffle's version)
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
};