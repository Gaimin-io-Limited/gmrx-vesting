const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("GMRX");
    const contract = await contractFactory.deploy();
    await contract.deployed();
    const txReceipt = await hre.ethers.provider.waitForTransaction(contract.deployTransaction.hash);
    let contractAddress = txReceipt.contractAddress;

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    // const contractX = await contractFactory.deploy();
    // await contractX.deployed();
    // const txReceipt = await hre.ethers.provider.waitForTransaction(contractX.deployTransaction.hash);
    // let contractAddress = txReceipt.contractAddress;
    // const contract = contractFactory.attach(contractAddress);
    // await contract.initialize("0x0000000000000000000000000000000000000000", gmrxAddress, 0, 1, 2000000000, 0);

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    // let tlwAddress = "0x1336DB2b9A517bB58ba0Fb41E82F105A3Dfd8DA6";
    // const contractX = await contractFactory.deploy(gmrxAddress, tlwAddress);
    // await contractX.deployed();
    // const txReceipt = await hre.ethers.provider.waitForTransaction(contractX.deployTransaction.hash);
    // let contractAddress = txReceipt.contractAddress;

    console.log("Contract deployed to:", contractAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
