const hre = require("hardhat");

async function main() {
    let gmrxAddress = "0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e";

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    let tlwAddress = "0x06E5D057280B9Cba511809c393c8c66C64ad675b";
    const contract = await contractFactory.deploy(gmrxAddress, tlwAddress);
    await contract.deployed();

    // const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    // const contract = await contractFactory.deploy();
    // await contract.deployed();
    // await contract.initialize("0x0000000000000000000000000000000000000000", gmrxAddress, 0, 1, 2000000000, 0);
    console.log("Contract deployed to:", contract.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
