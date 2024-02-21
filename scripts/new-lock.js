const hre = require("hardhat");

async function main() {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x97B8e73a6d4Ff3Bb87a8b73f4FF921f6d446F097");

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const factoryAddress = "0xa33960aB4665ed11E63240bcA8f08906f60F3817";
    const contract = contractFactory.attach(factoryAddress);

    let amount = (Math.floor(Math.random() * 1000) + 1) * 1000000000000000000;
    let initialTimestamp = Math.floor(new Date().getTime() / 1000) + 2 * 60;
    console.log("amount", amount.toString(), "time", initialTimestamp);

    const txAppr = await token.approve(factoryAddress, amount.toString());
    const receiptAppr = await txAppr.wait();
    console.log("approved");
    const txNewTWL = await contract.newTimeLockedWallet("0xE43466049d8233599Cf7c7D18AaA37924BF72Ea7", 1, amount.toString(), (amount*0.1).toString(), 2*60, 3 * 60, initialTimestamp);
    // address owner, uint groupId, uint totalAmount, uint tgeAmount, uint cliffDuration, uint fullDuration, uint initTimestamp
    console.log("init newTWL");
    const receiptNewTWL = await txNewTWL.wait();
    console.log(receiptNewTWL);
    for (let event of receiptNewTWL.events) {
        if (event.event === 'Created') {
            console.log(event.args[0])
        }
    }

}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
