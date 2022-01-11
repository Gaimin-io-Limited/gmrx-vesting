const csv = require('csv-parser');
const fs = require('fs');
const hre = require("hardhat");
const results = [];


async function main() {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e");
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const factoryAddress = "0x07b1e78Ea789FD6755b6C62D23301FC7074be6b0";
    const contract = contractFactory.attach(factoryAddress);

    let amount;
    let wallet;
    let numberOfPeriods;
    let firstUnlockTime;

    const startSalaryTime = Math.floor(new Date().getTime() / 1000)
    const amountMultiplier = '000000000000000000';

    const unlockEquity = startSalaryTime + (2678400*6);
    const unlockSeed = startSalaryTime + (2678400*2);
    const unlockStrategic =  startSalaryTime + (86400*21);
    const unlnockPrivate =  startSalaryTime + (86400*14);
    const unlnockPublic =  startSalaryTime + (86400*7);
    const unlnockCorporate =  startSalaryTime + (2678400*6);
    const unlnockCommunity =  startSalaryTime + 2678400;
    const unlnockNftGD =  startSalaryTime + 2678400;
    const unlnockDev =  startSalaryTime + (2678400*6);
    const unlnockTreasury =  startSalaryTime + 2678400;
    const unlnockTeam =  startSalaryTime + (2678400*12);

    const periodDuration = 86400

    fs.createReadStream(__dirname+'/username.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            results.map(async (item) => {

                    amount = item.Amount + amountMultiplier;
                    wallet = item.Wallet;
                    numberOfPeriods = item.Period * 30;

                    if (item.Group === 'Equity') {firstUnlockTime = unlockEquity;}

                    if (item.Group === 'Seed') {firstUnlockTime = unlockSeed;}

                    if (item.Group === 'Strategic') {firstUnlockTime = unlockStrategic;}

                    if (item.Group === 'Private') {firstUnlockTime = unlnockPrivate}

                    if (item.Group === 'Public') {firstUnlockTime = unlnockPublic;}

                    if (item.Group === 'Corporate') {firstUnlockTime = unlnockCorporate;}

                    if (item.Group === 'NFT') {firstUnlockTime = unlnockNftGD;}

                    if (item.Group === 'Community') {firstUnlockTime = unlnockCommunity;}

                    if (item.Group === 'Development') {firstUnlockTime = unlnockDev;}

                    if (item.Group === 'Treasury') {firstUnlockTime = unlnockTreasury;}

                    if (item.Group === 'Team') {firstUnlockTime = unlnockTeam}

                    let params = `${wallet + ' ' + amount.toString()
                    + '  ' + numberOfPeriods + '  ' + firstUnlockTime + '  ' + periodDuration}`
                    console.log( "\x1b[1m","parsed:","✔",params)

                    await token.approve(factoryAddress, amount.toString());
                    console.log("\x1b[42m","approved");

                    let result = await contract.newTimeLockedWallet(wallet,amount.toString(), numberOfPeriods, firstUnlockTime, periodDuration);
                    console.log("done: ", result);
                }
            )
        });
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });


