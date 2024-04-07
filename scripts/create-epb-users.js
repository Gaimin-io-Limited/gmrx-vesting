const hre = require("hardhat");
const fs = require('fs');
const csv = require("csv-parser");

const gmrxAddress = "0x998305efDC264b9674178899FFfBb44a47134a76";
const epbAddress = "0x6a9ff9c45Cbb30e7330691043f6cdF15c3ACc693";

async function createUsers(users) {
    let chunks = [];
    const chunkSize = 1000;
    for (let i = 0; i < users.length; i += chunkSize) {
        const chunk = users.slice(i, i + chunkSize);
        chunks.push(chunk);
    }
    let totalAmount = users.reduce((sum, curr) => sum + parseInt(curr.totalAmount), 0);
    console.log(totalAmount, users.length, chunks.length, chunks[chunks.length - 1].length);

    const epbContractFactory = await hre.ethers.getContractFactory("EngagementPortalBank");
    let epbContract = await epbContractFactory.attach(epbAddress);

    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach(gmrxAddress);
    let approveTx = await token.approve(epbAddress, hre.ethers.utils.parseEther('100000000'));
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
