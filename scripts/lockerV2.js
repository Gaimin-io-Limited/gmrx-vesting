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
            // console.log("receiptNewTWL: ", receiptNewTWL);
            for (let event of receiptNewTWL.events) {
                if (event.event === 'Created') {
                    let tlw
                    tlw = {...item,newWallet:event.args[0]}
                    newWallet.push(tlw)
                    fs.writeFileSync("NewTimeLock.CSV",convertToCSV())
                }
            }

     }

}

function locker(){
    const startSalaryTime = Math.floor(new Date().getTime() / 1000)
    const amountMultiplier = '000000000000000000';
    const unlockEquity = startSalaryTime + (2678400*6); //2592000 30 day
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
    const periodDuration = 86400;

    let amount;
    let wallet;
    let numberOfPeriods;
    let firstUnlockTime;

    list = results.map((item) => {

    amount = item.Amount + amountMultiplier;
    wallet = item.Wallet;
    numberOfPeriods = item.Period * 30;

     switch (item.Group) {
         case 'Equity':
             firstUnlockTime = unlockEquity;
             break
         case 'Seed' :
             firstUnlockTime = unlockSeed;
             break
         case 'Strategic' :
             firstUnlockTime = unlockStrategic;
             break
         case  'Private' :
             firstUnlockTime = unlnockPrivate
             break
         case 'Public' :
             firstUnlockTime = unlnockPublic;
             break
         case 'Corporate' :
             firstUnlockTime = unlnockCorporate;
             break
         case 'NFT':
             firstUnlockTime = unlnockNftGD;
             break
         case  'Community' :
             firstUnlockTime = unlnockCommunity;
             break
         case 'Development' :
             firstUnlockTime = unlnockDev;
             break
         case 'Treasury' :
             firstUnlockTime = unlnockTreasury;
             break
         case 'Team' :
             firstUnlockTime = unlnockTeam
             break
     }
        return {wallet, amount, numberOfPeriods,firstUnlockTime,periodDuration}

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



main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

  fs.createReadStream(__dirname+'/username.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            locker()
        });
