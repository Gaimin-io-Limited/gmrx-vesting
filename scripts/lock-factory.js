const hre = require("hardhat");

async function main() {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e");

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const factoryAddress = "0x07b1e78Ea789FD6755b6C62D23301FC7074be6b0";
    const contract = contractFactory.attach(factoryAddress);

    let amount = (Math.floor(Math.random() * 1000) + 1) * 1000000000000000000;
    let firstUnlockTime = Math.floor(new Date().getTime() / 1000) + 3 * 60;
    console.log("amount", amount.toString(), "time", firstUnlockTime);

    await token.approve(factoryAddress, amount.toString());
    console.log("approved");
    let result = await contract.newTimeLockedWallet("0xBD8911B2967efE7C98A731f5332A76526902AEe4", amount.toString(), 7, firstUnlockTime, 1 * 60);
    console.log("done: ", result);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
