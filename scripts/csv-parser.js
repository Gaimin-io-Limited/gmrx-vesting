const csv = require('csv-parser');
const fs = require('fs');
const results = [];

const startSalaryTime = Math.floor(new Date().getTime() / 1000)

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
        takeGroup(results)
    });


function takeGroup(data){
       let Equity = data.filter(item => item['Group'] === 'Equity');
       let Seed = data.filter(item => item['Group'] === 'Seed');
       let Strategic = data.filter(item => item['Group'] === 'Strategic');
       let Private = data.filter(item => item['Group'] === 'Private');
       let Public = data.filter(item => item['Group'] === 'Public');
       let Corporate = data.filter(item => item['Group'] === 'Corporate');
       let Community = data.filter(item => item['Group'] === 'Community');
       let Development = data.filter(item => item['Group'] === 'Development');
       let Treasury = data.filter(item => item['Group'] === 'Treasury');
       let Team = data.filter(item => item['Group'] === 'Team');
       let NFT = data.filter(item => item['Group'] === 'NFT');
    // console.log(Corporate)
       locker(Corporate);
}


function locker(data){
    let amount;
    let wallet;
    let numberOfPeriods = 1;
    let firstUnlockTime;

        data.map((item) => {

           if ( item.Group === 'Equity') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlockEquity;
           }

           if (item.Group === 'Seed') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlockSeed;
           }

           if (item.Group === 'Strategic') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlockStrategic;
           }

           if ( item.Group === 'Private') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockPrivate
           }

           if (item.Group === 'Public') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockPublic;
           }

           if (item.Group === 'Corporate') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockCorporate;
           }

           if (item.Group === 'NFT') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockNftGD;
           }

           if (item.Group === 'Community') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockCommunity;
           }

           if (item.Group === 'Development') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockDev;
           }

           if (item.Group === 'Treasury') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockTreasury;
           }

           if (item.Group === 'Team') {
               amount = item.Amount * 1000000000000000000;
               wallet = item.Wallet;
               firstUnlockTime = unlnockTeam
           }

           let r = `${wallet +' ' + amount.toString()
                + '  ' + numberOfPeriods  + '  ' +   unlnockCommunity  + '  ' + periodDuration }`
                console.log(r)

        }
        )
}

