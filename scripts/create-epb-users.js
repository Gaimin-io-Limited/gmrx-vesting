const hre = require("hardhat");
const fs = require('fs');
const csv = require("csv-parser");

const gmrxAddress = "0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575";
const engagementPortalBankAddress = "0xCD8a1C3ba11CF5ECfa6267617243239504a98d90";

async function createUsers(users) {
    let chunks = [];
    const chunkSize = 1000;
    for (let i = 0; i < users.length; i += chunkSize) {
        const chunk = users.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    console.log(users.length, chunks.length, chunks[chunks.length - 1].length);

    const epbContractFactory = await hre.ethers.getContractFactory("EngagementPortalBank");
    let epbContract = await epbContractFactory.attach(engagementPortalBankAddress);

    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach(gmrxAddress);
    let approveTx = await token.approve(engagementPortalBankAddress, hre.ethers.utils.parseEther('100000000'));
    await approveTx.wait();
    console.log('Approved')

    let gasUsed = 0;
    for (let i = 0; i < chunks.length; i++) {
        const tx = await epbContract.createUsers(chunks[i]);
        const txR = await tx.wait(1);
        gasUsed += txR.gasUsed.toNumber();
        console.log("chunkIndex: %s, txHash: %s, gasUsed: %s", i, txR.transactionHash, txR.gasUsed);
    }
    console.log("total gas used: %s", gasUsed);
}

async function readData() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(__dirname + '/data/EngagementPortalBankUsers-2.csv')
            .pipe(csv())
            .on('data', (row) => results.push(row))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
}

readData()
    .then(users => createUsers(users))
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
