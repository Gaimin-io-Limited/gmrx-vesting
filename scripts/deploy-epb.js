const hre = require("hardhat");

async function main() {
    const gmrxContractFactory = await hre.ethers.getContractFactory("GMRX");
    const gmrxContract = await gmrxContractFactory.deploy();
    await gmrxContract.deployed();
    const gmrxAddress = (await hre.ethers.provider.waitForTransaction(gmrxContract.deployTransaction.hash)).contractAddress;

    const epbContractFactory = await hre.ethers.getContractFactory("EngagementPortalBank");
    const epbContract = await epbContractFactory.deploy();
    await epbContract.deployed();
    const epbAddress = (await hre.ethers.provider.waitForTransaction(epbContract.deployTransaction.hash)).contractAddress;

    await epbContract.initialize(gmrxAddress, 50, 31104000, 1711447200);

    console.log("GMRX address:", gmrxAddress);
    console.log("EPB  address:", epbAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
