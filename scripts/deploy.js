const hre = require("hardhat");

async function main() {
    // const contractFactory = await hre.ethers.getContractFactory("GMRX");
    // const contract = await contractFactory.deploy();
    // await contract.deployed();
    // const txReceipt = await hre.ethers.provider.waitForTransaction(contract.deployTransaction.hash);
    // let gmrxAddress = txReceipt.contractAddress;
    let gmrxAddress = "0x97B8e73a6d4Ff3Bb87a8b73f4FF921f6d446F097";

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    // const contractX = await contractFactory.deploy();
    // await contractX.deployed();
    // const txReceipt = await hre.ethers.provider.waitForTransaction(contractX.deployTransaction.hash);
    // let tlwAddress = txReceipt.contractAddress;
    let tlwAddress = "0x43648fd9a14853249cb6a3176bb153f0fc42cc56";
    // console.log("Contract deployed to:", tlwAddress);
    // const contract = contractFactory.attach(tlwAddress);
    // await contract.initialize("0xE43466049d8233599Cf7c7D18AaA37924BF72Ea7", gmrxAddress, 1, 0, 0, 0, 100000000000);

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    // const factory = await contractFactory.deploy(gmrxAddress, tlwAddress);
    // await factory.deployed();
    // const txReceipt = await hre.ethers.provider.waitForTransaction(factory.deployTransaction.hash);
    // let factoryAddress = txReceipt.contractAddress;
    // console.log("Contract deployed to:", factoryAddress);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
