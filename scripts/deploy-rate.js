const hre = require("hardhat");

async function main() {
    const rateContractFactory = await hre.ethers.getContractFactory("GmrxRate");
    const rateContract = await rateContractFactory.deploy();
    await rateContract.deployed();
    const rateAddress = (await hre.ethers.provider.waitForTransaction(rateContract.deployTransaction.hash)).contractAddress;

    console.log("Rate address:", rateAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
