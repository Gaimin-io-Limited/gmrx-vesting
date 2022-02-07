const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0x4ebF5583878576b987386b82832AE7343c548acC");

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

