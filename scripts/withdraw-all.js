const hre = require("hardhat");

async function main() {
    const tlwFactoryContractFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
    const tlwFactoryContract = tlwFactoryContractFactory.attach("0x6212ea5f43481A91F3352aB091C11E48B06F4126");
    // console.log("wallets 1200: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1200)).toString());
    // console.log("wallets 1300: ", (await tlwFactoryContract.getWallets("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1300)).toString());
    // Done
    // let tx302 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 302); console.log((await tx302.wait()).gasUsed);

    // Tuesday from 26.03.2024
    // Chainlink let tx400 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 400); console.log((await tx400.wait()).gasUsed);
    // Chainlink let tx600 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 600); console.log((await tx600.wait()).gasUsed);
    // Chainlink let tx800 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 800); console.log((await tx800.wait()).gasUsed);
    // Thursday from 02.05.2024
    let tx200 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 200); console.log((await tx200.wait()).gasUsed);
    let tx201 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 201); console.log((await tx201.wait()).gasUsed);
    let tx202 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 202); console.log((await tx202.wait()).gasUsed);
    let tx203 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 203); console.log((await tx203.wait()).gasUsed);
    let tx204 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 204); console.log((await tx204.wait()).gasUsed);
    let tx205 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 205); console.log((await tx205.wait()).gasUsed);
    let tx206 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 206); console.log((await tx206.wait()).gasUsed);
    // Chainlink let tx301 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 301); console.log((await tx301.wait()).gasUsed);
    // Friday from 17.05.2024
    // Chainlink let tx1200 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1200); console.log((await tx1200.wait()).gasUsed);
    // Chainlink let tx1300 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1300); console.log((await tx1300.wait()).gasUsed);
    // Saturday from 01.06.24
    // Chainlink let tx1100 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1100); console.log((await tx1100.wait()).gasUsed);
    // Monday from 01.07.24
    // Chainlink let tx1000 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 1000); console.log((await tx1000.wait()).gasUsed);
    // Chainlink let tx300 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 300); console.log((await tx300.wait()).gasUsed);

    //30.08.24 let tx900 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 900); console.log((await tx900.wait()).gasUsed);
    //29.09.24 let tx100 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 100); console.log((await tx100.wait()).gasUsed);
    //29.09.24 let tx500 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 500); console.log((await tx500.wait()).gasUsed);
    //28.03.25 let tx700 = await tlwFactoryContract.withdrawAll("0xb27b44DF91D33338A024097172dc946D4445a3E2", 700); console.log((await tx700.wait()).gasUsed);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

