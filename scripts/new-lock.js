const hre = require("hardhat");

async function main() {
    const tokenFactory = await hre.ethers.getContractFactory("GMRX");
    const token = tokenFactory.attach("0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e");

    const contractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const contract = contractFactory.attach("0x757209d4B12368A4E42c5e117784e139f71252F8");

    let amount = (Math.floor(Math.random() * 100) + 1) * 1000000000000000000;
    let time = Math.floor(new Date().getTime() / 1000) + 5 * 60;
    console.log("amount", amount.toString(), "time", time);

    await token.approve("0x757209d4B12368A4E42c5e117784e139f71252F8", amount.toString());
    console.log("approved");
    let result = await contract.newTimeLockedWallet("0xBD8911B2967efE7C98A731f5332A76526902AEe4", amount.toString(), time);
    console.log("done: ", result);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
