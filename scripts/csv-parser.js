const csv = require('csv-parser');
const fs = require('fs');
const results = [];

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
let params;

fs.createReadStream(__dirname+'/username.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        locker(results)
        console.log( "\x1b[2m",'Done')
        console.log(params)
    });


// function takeGroup(data){
//        let Equity = data.filter(item => item['Group'] === 'Equity');
//        let Seed = data.filter(item => item['Group'] === 'Seed');
//        let Strategic = data.filter(item => item['Group'] === 'Strategic');
//        let Private = data.filter(item => item['Group'] === 'Private');
//        let Public = data.filter(item => item['Group'] === 'Public');
//        let Corporate = data.filter(item => item['Group'] === 'Corporate');
//        let Community = data.filter(item => item['Group'] === 'Community');
//        let Development = data.filter(item => item['Group'] === 'Development');
//        let Treasury = data.filter(item => item['Group'] === 'Treasury');
//        let Team = data.filter(item => item['Group'] === 'Team');
//        let NFT = data.filter(item => item['Group'] === 'NFT');
//     console.log(Corporate)
//        locker(data);
// }


function locker(data){
    let amount;
    let wallet;
    let numberOfPeriods = 1;
    let firstUnlockTime;

        data.map((item) => {

                amount = item.Amount + amountMultiplier;
                wallet = item.Wallet;
                numberOfPeriods = item.Period * 30;

           if ( item.Group === 'Equity') {
               firstUnlockTime = unlockEquity;
           }

           if (item.Group === 'Seed') {
               firstUnlockTime = unlockSeed;
           }

           if (item.Group === 'Strategic') {
               firstUnlockTime = unlockStrategic;
           }

           if ( item.Group === 'Private') {
               firstUnlockTime = unlnockPrivate
           }

           if (item.Group === 'Public') {
               firstUnlockTime = unlnockPublic;
           }

           if (item.Group === 'Corporate') {
               firstUnlockTime = unlnockCorporate;
           }

           if (item.Group === 'NFT') {
               firstUnlockTime = unlnockNftGD;
           }

           if (item.Group === 'Community') {
               firstUnlockTime = unlnockCommunity;
           }

           if (item.Group === 'Development') {
               firstUnlockTime = unlnockDev;
           }

           if (item.Group === 'Treasury') {
               firstUnlockTime = unlnockTreasury;
           }

           if (item.Group === 'Team') {
               firstUnlockTime = unlnockTeam
           }

            params = {wallet, amount, numberOfPeriods,firstUnlockTime,periodDuration}

           let r = `${wallet +' ' + amount.toString()
                + '  ' + numberOfPeriods  + '  ' +   firstUnlockTime  + '  ' + periodDuration }`
                // console.log('✔' ,r)
            //     console.log( "\x1b[1m","parsed:","✔",r)
             console.log(params)
            return params

        }
        )
}

