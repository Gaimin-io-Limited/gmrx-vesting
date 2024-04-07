const hre = require("hardhat");

async function main() {
    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = tlwFactoryContractFactory.attach("0x6212ea5f43481A91F3352aB091C11E48B06F4126");
    // console.log("wallets 100: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 100)).toString());
    // console.log("wallets 200: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 200)).toString());
    // console.log("wallets 201: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 201)).toString());
    // console.log("wallets 202: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 202)).toString());
    // console.log("wallets 203: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 203)).toString());
    // console.log("wallets 204: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 204)).toString());
    // console.log("wallets 205: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 205)).toString());
    // console.log("wallets 206: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 206)).toString());
    // console.log("wallets 300: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 300)).toString());
    // console.log("wallets 301: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 301)).toString());
    // console.log("wallets 302: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 302)).toString());
    // console.log("wallets 400: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 400)).toString());
    // console.log("wallets 500: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 500)).toString());
    // console.log("wallets 600: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 600)).toString());
    // console.log("wallets 700: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 700)).toString());
    // console.log("wallets 800: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 800)).toString());
    // let tx100 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 100); console.log((await tx100.wait()).gasUsed);
    // let tx200 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 200); console.log((await tx200.wait()).gasUsed);
    // let tx201 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 201); console.log((await tx201.wait()).gasUsed);
    // let tx202 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 202); console.log((await tx202.wait()).gasUsed);
    // let tx203 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 203); console.log((await tx203.wait()).gasUsed);
    // let tx204 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 204); console.log((await tx204.wait()).gasUsed);
    // let tx205 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 205); console.log((await tx205.wait()).gasUsed);
    // let tx206 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 206); console.log((await tx206.wait()).gasUsed);
    // let tx300 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 300); console.log((await tx300.wait()).gasUsed);
    // let tx301 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 301); console.log((await tx301.wait()).gasUsed);
    // let tx302 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 302); console.log((await tx302.wait()).gasUsed);
    // let tx400 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 400); console.log((await tx400.wait()).gasUsed);
    // let tx500 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 500); console.log((await tx500.wait()).gasUsed);
    // let tx600 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 600); console.log((await tx600.wait()).gasUsed);
    // let tx700 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 700); console.log((await tx700.wait()).gasUsed);
    // let tx800 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 800); console.log((await tx800.wait()).gasUsed);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

