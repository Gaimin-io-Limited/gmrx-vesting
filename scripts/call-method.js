const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0xe6Dd868EEEfCBc13E244cB06ad9d47D549745298");
    console.log("done: ", await contract.initialize("0xBD8911B2967efE7C98A731f5332A76526902AEe4", "0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e", 0, 1, 2000000000, 0));
    //                                             (address owner, address tokenContract, uint amount, uint numberOfPeriods, uint firstUnlockTime, uint periodDuration)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
