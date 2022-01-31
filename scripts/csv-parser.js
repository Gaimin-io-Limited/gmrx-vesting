const fs = require('fs');

const newWallet = [
    {
        wallet: '0x5f1d00a3698ab45f588D089385Cc3E3463326390',
        amount: '1000000000000000000',
        numberOfPeriods: 30,
        firstUnlockTime: 1659361822,
        periodDuration: 86400,
        newWallet: '0xe0b128aEfB41D929A88C680e4b1478fecadA0Ed0'
    },
    {
        wallet: '0x936093Ce96Af55B0f3dD20bb213dEc3e539d0FFb',
        amount: '1000000000000000000',
        numberOfPeriods: 30,
        firstUnlockTime: 1648648222,
        periodDuration: 86400,
        newWallet: '0x92538E5fC6c85360514635EC5f353326D3EF1339'
    },
    {
        wallet: '0xD4de52c348621909b1Ddbf12C1E68A3F09b5905d',
        amount: '1000000000000000000',
        numberOfPeriods: 30,
        firstUnlockTime: 1659361822,
        periodDuration: 86400,
        newWallet: '0xA5659E520e9D74facC9012d928756d0f1C8BcD53'
    }
]

function convertToCSV() {
    return [
        [
            "Wallet",
            "Mew Lock Wallet"
        ],
        ...newWallet.map(item => [
            item.wallet,
            item.newWallet
        ])
    ]
        .map(e => e.join(","))
        .join("\n")
}

fs.writeFileSync("ss.csv", convertToCSV());
