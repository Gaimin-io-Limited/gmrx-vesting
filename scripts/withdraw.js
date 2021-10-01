const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0xeA450f2b12a0bA49609BD1D54f4f714D9e569518");

    console.log("lockedAmount: ", (await contract.lockedAmount()).toString());
    console.log("readyToWithdraw: ", (await contract.readyToWithdraw()).toString());

    console.log("withdraw: ", await contract.withdrawTokens());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
