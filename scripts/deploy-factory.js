const hre = require("hardhat");

async function main() {
    const gmrxContractFactory = await hre.ethers.getContractFactory("GMRX");
    const gmrxContract = await gmrxContractFactory.deploy();
    await gmrxContract.deployed();
    const gmrxAddress = (await hre.ethers.provider.waitForTransaction(gmrxContract.deployTransaction.hash)).contractAddress;
    // const gmrxAddress = "0x97B8e73a6d4Ff3Bb87a8b73f4FF921f6d446F097";

    const tlwContractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    let tlwContract = await tlwContractFactory.deploy();
    await tlwContract.deployed();
    const tlwAddress = (await hre.ethers.provider.waitForTransaction(tlwContract.deployTransaction.hash)).contractAddress;
    // const tlwAddress = "0x1336DB2b9A517bB58ba0Fb41E82F105A3Dfd8DA6";
    // tlwContract = tlwContractFactory.attach(tlwAddress);
    // await tlwContract.initialize("0x0000000000000000000000000000000000000000", gmrxAddress, 0, 1, 2000000000, 0);

    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = await tlwFactoryContractFactory.deploy(gmrxAddress, tlwAddress);
    await tlwFactoryContract.deployed();
    const tlwFactoryAddress = (await hre.ethers.provider.waitForTransaction(tlwFactoryContract.deployTransaction.hash)).contractAddress;

    console.log("GMRX address:", gmrxAddress);
    console.log("TLW address:", tlwAddress);
    console.log("Factory address:", tlwFactoryAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
