require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const polygonscanApikey = process.env.POLYGONSCAN_API_KEY;
const alchemyAppId = process.env.ALCHEMY_APP_ID;

module.exports = {
    defaultNetwork: "mumbai",
    networks: {
        hardhat: {},
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyAppId}`,
            accounts: [privateKey],
            // gas: 10_000_000,            // (max: 20_000_000)
            // gasPrice: 20_000_000_000
        },
        polygon: {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyAppId}`,
            accounts: [privateKey],
            // gas: 10_000_000,            // (max: 30_000_000)
        }
    },
    solidity: {
        version: "0.8.4",
        settings: {
            optimizer: {
                enabled: false,
                runs: 200
            }
        }
    },
    etherscan: {
        apiKey: polygonscanApikey
    }
};
