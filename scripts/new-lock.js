const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const contract = contractFactory.attach("0x430d2Dc0b5d3a008d479A4B7500690908110fb36");

    let time = Math.floor(new Date().getTime() / 1000) + 5 * 60;
    let value = hre.ethers.utils.parseEther("0.001");
    console.log("time", time, " value", value.toString());

    let result = await contract.newTimeLockedWallet("0xBD8911B2967efE7C98A731f5332A76526902AEe4", time, {value: value});

    console.log("done: ", result);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
