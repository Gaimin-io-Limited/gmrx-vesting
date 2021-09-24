require("@nomiclabs/hardhat-waffle");
require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY;
const polygonscanApikey = process.env.POLYGONSCAN_API_KEY;
const maticvigilAppId = process.env.MATICVIGIL_APP_ID;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
    const accounts = await ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

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
        version: "0.8.1",
        settings: {
            optimizer: {
                enabled: false,
                runs: 200
            }
        }
    },
    etherscan: {
        apiKey: polygonscanApikey
    },
};
