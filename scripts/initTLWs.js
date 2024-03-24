const csv = require('csv-parser');
const fs = require('fs');
const hre = require('hardhat');
const vestingGroups = require('./data/vestingGroups');

async function callFactory(tokenBuyers) {
    const tlwFactoryAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x5FbDB2315678afecb367f032d93F642f64180aa3");
    let totalAmount = tokenBuyers.reduce((sum, next) => sum + parseInt(next.totalAmount), 0);
    let approveTx = await token.approve(tlwFactoryAddress, hre.ethers.utils.parseEther(totalAmount.toString()));
    await approveTx.wait();
    console.log('Approved')

    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = tlwFactoryContractFactory.attach(tlwFactoryAddress);
    let tlws = [];

    for (const tokenBuyer of tokenBuyers) {
        let result = await tlwFactoryContract.newTimeLockedWallet(tokenBuyer.owner, tokenBuyer.groupId,
            hre.ethers.utils.parseEther(tokenBuyer.totalAmount.toString()),
            hre.ethers.utils.parseEther(tokenBuyer.tgeAmount.toString()),
            tokenBuyer.cliffDuration, tokenBuyer.vestingDuration, tokenBuyer.initTimestamp);
        const receiptNewTWL = await result.wait();
        for (let event of receiptNewTWL.events) {
            if (event.event === 'Created') {
                console.log(event.args[0]);
                let tlw = {owner: tokenBuyer.owner, tlw: event.args[0], groupId: tokenBuyer.groupId}
                tlws.push(tlw)
            }
        }
    }
    fs.writeFileSync(__dirname + "/data/NewTimeLock.csv", convertToCSV(tlws))
}

function convertToCSV(tlws) {
    return [
        [
            "owner",
            "tlw",
            "groupId"
        ],
        ...tlws.map(tlw => [
            tlw.owner,
            tlw.tlw,
            tlw.groupId
        ])
    ]
        .map(e => e.join(","))
        .join("\n")
}

async function parseData(tokenBuyers) {
    const initTimestamp = 1611447200;
    return new Promise((resolve) => {
        tokenBuyers.forEach(tokenBuyer => {
            let vestingGroup = vestingGroups[tokenBuyer.groupId];
            tokenBuyer.tgeAmount = tokenBuyer.totalAmount * vestingGroup.tgePercent / 100;
            tokenBuyer.cliffDuration = vestingGroup.cliffDuration;
            tokenBuyer.vestingDuration = vestingGroup.vestingDuration;
            tokenBuyer.initTimestamp = initTimestamp;
        })
        resolve(tokenBuyers);
    })
}

async function readData() {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(__dirname + '/data/tokenBuyers.csv')
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

readData()
    .then(tokenBuyers => parseData(tokenBuyers))
    .then(tokenBuyers => callFactory(tokenBuyers))
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });





