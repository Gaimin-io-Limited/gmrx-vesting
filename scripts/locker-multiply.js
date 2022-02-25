const csv = require('csv-parser');
const fs = require('fs');
const hre = require("hardhat");
const results = [];
const newWallet = []
let list;

async function main() {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e");

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const factoryAddress = "0x07b1e78Ea789FD6755b6C62D23301FC7074be6b0";
    const contract = contractFactory.attach(factoryAddress);


    for (const item of list) {
        const txAppr = await token.approve(factoryAddress, item.amount);
        const receiptAppr = await txAppr.wait();
        console.log("approved");
        let result = await contract.newTimeLockedWallet(item.wallet, item.amount, item.numberOfPeriods, item.firstUnlockTime, item.periodDuration);
        console.log("done: ", result);
        const receiptNewTWL = await result.wait();
        console.log("receiptNewTWL: ", receiptNewTWL);
        for (let event of receiptNewTWL.events) {
            if (event.event === 'Created') {
                let tlw
                tlw = {...item, newWallet: event.args[0]}
                newWallet.push(tlw)
                fs.writeFileSync(__dirname + "/NewTimeLock.csv", convertToCSV())
            }
        }
    }
}

function parserData() {
    const startSalaryTime = Math.floor(new Date().getTime() / 1000)
    const amountMultiplier = '000000000000000000';
    const unlockEquity = startSalaryTime + (2678400 * 6); //2592000 30 day
    const unlockSeed = startSalaryTime + (2678400 * 2);
    const unlockStrategic = startSalaryTime + (86400 * 21);
    const unlockPrivate = startSalaryTime + (86400 * 14);
    const unlockPublic = startSalaryTime + (86400 * 7);
    const unlockCorporate = startSalaryTime + (2678400 * 6);
    const unlockCommunity = startSalaryTime + 2678400;
    const unlockNftGD = startSalaryTime + 2678400;
    const unlockDev = startSalaryTime + (2678400 * 6);
    const unlockTreasury = startSalaryTime + 2678400;
    const unlockTeam = startSalaryTime + (2678400 * 12);
    const unlockAdditional = startSalaryTime + 2678400;
    const periodDuration = 86400;

    let amount;
    let wallet;
    let numberOfPeriods;
    let firstUnlockTime;

    list = results.map((item) => {
        amount = item.Amount + amountMultiplier;
        wallet = item.Wallet;

        switch (item.Group) {
            case 'Equity':
                firstUnlockTime = unlockEquity;
                numberOfPeriods = 60*30
                break
            case 'Seed' :
                firstUnlockTime = unlockSeed;
                numberOfPeriods = 24*30
                break
            case 'Strategic' :
                firstUnlockTime = unlockStrategic;
                numberOfPeriods = 18*30
                break
            case  'Private' :
                firstUnlockTime = unlockPrivate
                numberOfPeriods = 12*30
                break
            case 'Public' :
                firstUnlockTime = unlockPublic;
                numberOfPeriods = 6*30
                break
            case 'Corporate' :
                firstUnlockTime = unlockCorporate;
                numberOfPeriods = 24*30
                break
            case 'NFT':
                firstUnlockTime = unlockNftGD;
                numberOfPeriods = 12*30
                break
            case 'Additional':
                firstUnlockTime = unlockAdditional;
                numberOfPeriods = 48*30
                break
            case  'Community' :
                firstUnlockTime = unlockCommunity;
                numberOfPeriods = 12*30
                break
            case 'Development' :
                firstUnlockTime = unlockDev;
                numberOfPeriods = 48*30
                break
            case 'Treasury' :
                firstUnlockTime = unlockTreasury;
                numberOfPeriods = 48*30
                break
            case 'Team' :
                firstUnlockTime = unlockTeam
                numberOfPeriods = 60*30
                break
        }
        return {wallet, amount, numberOfPeriods, firstUnlockTime, periodDuration}
    })
}

function convertToCSV() {
    return [
        [
            "Wallet",
            "New Lock Wallet"
        ],
        ...newWallet.map(item => [
            item.wallet,
            item.newWallet
        ])
    ]
        .map(e => e.join(","))
        .join("\n")
}

async function readData() {
    fs.createReadStream(__dirname + '/data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            parserData()
        });
}


readData()
    .then(() => main())
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });





