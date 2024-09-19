const csv = require('csv-parser');
const fs = require('fs');
const hre = require('hardhat');
const vestingGroups = require('./data/vestingGroups');

const gmrxAddress = "0x998305efDC264b9674178899FFfBb44a47134a76";
const tlwFactoryAddress = "0x6212ea5f43481A91F3352aB091C11E48B06F4126";

async function callFactory(tokenBuyers) {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach(gmrxAddress);
    let totalAmountByGroup = tokenBuyers.reduce((group, curr) => {
        if (group[curr.groupId]) {
            group[curr.groupId] += curr.totalAmount;
        } else {
            group[curr.groupId] = curr.totalAmount;
        }
        return group;
    }, {});
    console.log(totalAmountByGroup);

    let totalAmount = Object.values(totalAmountByGroup).reduce((sum, curr) => sum + curr, 0);
    console.log(totalAmount);
    let approveTx = await token.approve(tlwFactoryAddress, hre.ethers.utils.parseEther(totalAmount.toString()));
    await approveTx.wait();
    console.log('Approved');

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
                console.log(tokenBuyer.owner, ',', event.args[0], ',', tokenBuyer.groupId);
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
    return new Promise((resolve) => {
        tokenBuyers.forEach(tokenBuyer => {
            let vestingGroup = vestingGroups[tokenBuyer.groupId];
            tokenBuyer.totalAmount = parseFloat(tokenBuyer.totalAmount);
            tokenBuyer.tgeAmount = tokenBuyer.totalAmount * vestingGroup.tgePercent / 100;
            tokenBuyer.cliffDuration = vestingGroup.cliffDuration;
            tokenBuyer.vestingDuration = vestingGroup.vestingDuration;
            tokenBuyer.initTimestamp = vestingGroup.initTimestamp;
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





