require('@nomiclabs/hardhat-ethers');
require("@nomicfoundation/hardhat-verify");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const bscscanApikey = process.env.BSCSCAN_API_KEY;
const noderealApiKey = process.env.NODEREAL_API_KEY;

module.exports = {
    defaultNetwork: "localhost",
    networks: {
        localhost: {
            blockGasLimit: 140000000
        },
        bnb_chain: {
            url: `https://bsc-mainnet.nodereal.io/v1/${noderealApiKey}`,
            accounts: [privateKey],
            chainId: 56
        },
        bnb_chain_testnet: {
            url: `https://bsc-testnet.nodereal.io/v1/${noderealApiKey}`,
            accounts: [privateKey],
            chainId: 97
        }
    },
    solidity: {
        compilers: [
            {
                version: "0.8.23"
            },
            {
                version: "0.8.24",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 1_000_000
                    }
                }
            }
        ]
    },
    etherscan: {
        apiKey: {
            bsc: bscscanApikey,
            bscTestnet: bscscanApikey
        }
    }
};
