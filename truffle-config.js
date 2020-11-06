const path = require("path");
const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          "Your mne-monic-phase",
          "http:infura.io/v3/your_id"
        ),
      network_id: "4",
    },
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.7.0",
    },
  },
};
