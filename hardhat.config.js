require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const polygonscanApikey = "IN194AG23PKQFB2VIEJMR7KQUHGXDXDUHJ";
const maticvigilAppId = "fd0ba0c297cf03e21d0db62c4b1afc17b473d9f8";
module.exports = {
    defaultNetwork: "mumbai",
    networks: {
        hardhat: {},
        mumbai: {
            url: `https://rpc-mumbai.maticvigil.com/v1/${maticvigilAppId}`,
            accounts: [privateKey]
        },
        polygon: {
            url: `https://rpc-mainnet.maticvigil.com/v1/${maticvigilAppId}`,
            accounts: [privateKey]
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
