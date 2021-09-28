const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const contract = await contractFactory.deploy();
    await contract.deployed();

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    // const contract = await contractFactory.deploy("0xBD8911B2967efE7C98A731f5332A76526902AEe4", "0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e", 11, 1632755762);
    // await contract.deployed();

    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
