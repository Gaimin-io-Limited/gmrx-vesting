require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const polygonscanApikey = process.env.POLYGONSCAN_API_KEY;
const bscscanApikey = process.env.BSCSCAN_API_KEY;
const alchemyAppId = process.env.ALCHEMY_APP_ID;
const noderealapikey = process.env.NODEREAL_API_KEY;

module.exports = {
    defaultNetwork: "localhost",
    networks: {
        polygon: {
            url: `https://polygon-mainnet.g.alchemy.com/v2/${alchemyAppId}`,
            accounts: [privateKey],
            // gas: 10_000_000,            // (max: 30_000_000)
        },
        mumbai: {
            url: `https://polygon-mumbai.g.alchemy.com/v2/${alchemyAppId}`,
            accounts: [privateKey],
            // gas: 10_000_000,            // (max: 20_000_000)
            // gasPrice: 20_000_000_000
        },
        bnb_chain: {
            url: `https://bsc-mainnet.nodereal.io/v1/${noderealapikey}`,
            accounts: [privateKey]
        },
        bnb_chain_testnet: {
            url: `https://bsc-testnet.nodereal.io/v1/${noderealapikey}`,
            accounts: [privateKey]
        },
    },
    solidity: {
        version: "0.8.23",
        settings: {
            optimizer: {
                enabled: false,
                runs: 200
            }
        }
    },
    etherscan: {
        // apiKey: polygonscanApikey
        apiKey: bscscanApikey
    }
};
