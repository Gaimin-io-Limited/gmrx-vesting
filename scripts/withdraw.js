const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0x4A84D14C1e44ee058096b5F35A69Af2A1Cc6e0aA");

    console.log("lockedAmount: ", (await contract.lockedAmount()).toString());
    console.log("readyToWithdraw: ", (await contract.readyToWithdraw()).toString());

    console.log("withdraw: ", await contract.withdraw());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
