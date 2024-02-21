const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0x40aF01cd8C0ab7AFd76A3CC49ea4e5d78C4C013A");

    console.log("remainingAmount: ", (await contract.remainingAmount()).toString());
    console.log("readyToWithdraw: ", (await contract.readyToWithdraw()).toString());

    console.log("withdraw: ", await contract.withdraw());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

