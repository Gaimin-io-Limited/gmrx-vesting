const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0xF45bcaDCc83dea176213Ae4E22f5aF918d08647b");
    console.log(await contract.initTimestamp());
    console.log(await contract.readyToWithdraw());
    console.log(await contract.remainingAmount());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
