const hre = require("hardhat");

async function main() {
    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWallet");
    const contract = contractFactory.attach("0x53Adc3924D58B9e0E30fEea7BAB473614920AE09");

    let data = await contract.info();
    data.forEach(d => console.log(d));
    console.log("lockedAmount: ", await contract.lockedAmount());

    console.log("withdraw: ", await contract.withdrawTokens());
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
