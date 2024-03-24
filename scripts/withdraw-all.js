const hre = require("hardhat");

async function main() {
    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = tlwFactoryContractFactory.attach("0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    // console.log("wallets 1 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 1)).toString());
    // console.log("wallets 2 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 2)).toString());
    // console.log("wallets 3 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 3)).toString());
    // console.log("wallets 4 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 4)).toString());
    // console.log("wallets 5 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 5)).toString());
    // console.log("wallets 6 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 6)).toString());
    // console.log("wallets 7 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 7)).toString());
    // console.log("wallets 8 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 8)).toString());
    // console.log("wallets 9 : ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 9)).toString());
    // console.log("wallets 10: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 10)).toString());
    // console.log("wallets 11: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 11)).toString());
    // console.log("wallets 12: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 12)).toString());
    // console.log("wallets 13: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 13)).toString());
    // console.log("wallets 14: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 14)).toString());
    // console.log("wallets 15: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 15)).toString());
    // console.log("wallets 16: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 16)).toString());
    // console.log("wallets 17: ", (await tlwFactoryContract.getWallets("0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", 17)).toString());
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

