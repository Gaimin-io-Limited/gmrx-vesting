const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("GMRX");
    const contract = contractFactory.attach("0x9037dd49bed73b3b2a99fce722d2f9207027bc3e");

    console.log("done: ", await contract.transfer("0xe6Dd868EEEfCBc13E244cB06ad9d47D549745298", 10));
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
