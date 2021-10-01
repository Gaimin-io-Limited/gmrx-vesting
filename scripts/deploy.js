const hre = require("hardhat");

async function main() {
    let gmrxAddress = "0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e";

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    let tlwAddress = "0xA89b596273c184568773c5803Fa6c1817C06CA50";
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
