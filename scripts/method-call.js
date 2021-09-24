const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0x05b50E3404CBA73752F3a641a49A45a2d706485b");

    let info = await contract.info();
    console.log("done: ", info);

    let result = await contract.withdraw();
    console.log("done: ", result);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
