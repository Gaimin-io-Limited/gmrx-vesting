const hre = require("hardhat");
const fs = require("fs");
const csv = require('csv-parser');
const wallets = []
let wallet  = []

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");

    for (const item of wallet) {
        const contract = await contractFactory.attach(item);
        console.log(item)
        console.log("withdraw: ", await contract.withdraw());
    }
    // console.log("lockedAmount: ", (await contract.lockedAmount()).toString());
    // console.log("readyToWithdraw: ", (await contract.readyToWithdraw()).toString());
    // console.log("withdraw: ", await contract.withdraw());



}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

fs.createReadStream(__dirname+'/NewTimeLock.csv')
    .pipe(csv())
    .on('data', (data) => wallets.push(data))
    .on('end', () => {
        wallet = wallets.map(e=>e['New Lock Wallet'])
    });
