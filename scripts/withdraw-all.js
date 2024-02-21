const hre = require("hardhat");

async function main() {
    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = tlwFactoryContractFactory.attach("0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");
    // console.log("wallets: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1)).toString());
    let tx = await tlwFactoryContract.withdrawAll("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1);
    const receipt = await tx.wait();
    console.log(receipt.gasUsed);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

