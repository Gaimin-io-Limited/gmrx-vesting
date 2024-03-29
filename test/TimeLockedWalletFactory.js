const hre = require('hardhat');
const {time} = require("@nomicfoundation/hardhat-network-helpers");
const {solidity} = require('ethereum-waffle');
let expect;

before(async function () {
    const chai = await import('chai');
    chai.use(solidity);
    expect = chai.expect;
});

describe("TimeLockedWalletFactory", function () {
    let TimeLockedWalletFactory, timeLockedWalletFactory, TimeLockedWallet, timeLockedWallet,
        Token, token, tokenOwner, tlwOwner, randomAddress;

    const GROUP_ID = 1;
    const TOTAL_AMOUNT = hre.ethers.BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const TGE_AMOUNT = hre.ethers.BigNumber.from('1000000000000000000000'); // 1000 GMRX
    const LOCKED_AMOUNT = TOTAL_AMOUNT.sub(TGE_AMOUNT);
    const CLIFF_DURATION = 60 * 60 * 24 * 30; // 30 days
    const VESTING_DURATION = 60 * 60 * 24 * 365; // 1 year
    let initTimestamp;

    beforeEach(async function () {
        TimeLockedWalletFactory = await hre.ethers.getContractFactory("TimeLockedWalletFactory");
        [tokenOwner, tlwOwner, randomAddress] = await hre.ethers.getSigners();

        initTimestamp = (await time.latest());
        TimeLockedWallet = await hre.ethers.getContractFactory('TimeLockedWallet');
        Token = await hre.ethers.getContractFactory('GMRX');
        timeLockedWallet = await TimeLockedWallet.deploy();
        token = await Token.connect(tokenOwner).deploy();

        timeLockedWalletFactory = await TimeLockedWalletFactory.deploy(token.address, timeLockedWallet.address);
        token.connect(tokenOwner).approve(timeLockedWalletFactory.address, TOTAL_AMOUNT);
    });

    it("creates a new time locked wallet and emit event", async function () {
        const newTimeLockedWalletTx = await timeLockedWalletFactory.connect(tokenOwner)
            .newTimeLockedWallet(tlwOwner.address, GROUP_ID, TOTAL_AMOUNT, TGE_AMOUNT, CLIFF_DURATION, VESTING_DURATION, initTimestamp);
        const receipt = await newTimeLockedWalletTx.wait();
        const walletAddress = receipt.events?.find(e => e.event === 'Created').args.wallet;

        await expect(newTimeLockedWalletTx)
            .to.emit(timeLockedWalletFactory, 'Created')
            .withArgs(walletAddress, tokenOwner.address, tlwOwner.address, GROUP_ID, TOTAL_AMOUNT, TGE_AMOUNT, CLIFF_DURATION, VESTING_DURATION, initTimestamp);
    });

    it("creates a new time locked wallet using clone method", async function () {
        const initialWalletsCount = (await timeLockedWalletFactory.getWallets(tokenOwner.address, GROUP_ID)).length;

        const tx = await timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, GROUP_ID, TOTAL_AMOUNT, TGE_AMOUNT, CLIFF_DURATION, VESTING_DURATION, initTimestamp);
        const receipt = await tx.wait();
        const walletAddress = receipt.events?.find(e => e.event === 'Created').args.wallet;

        const newWalletsCount = (await timeLockedWalletFactory.getWallets(tokenOwner.address, GROUP_ID)).length;

        expect(newWalletsCount).to.equal(initialWalletsCount + 1);

        const wallet = TimeLockedWallet.attach(walletAddress);

        expect(await wallet.owner()).to.equal(tlwOwner.address);
        expect(await wallet.tgeAmount()).to.equal(TGE_AMOUNT);
        expect(await wallet.lockedAmount()).to.equal(LOCKED_AMOUNT);
        expect(await wallet.cliffDuration()).to.equal(CLIFF_DURATION);
        expect(await wallet.vestingDuration()).to.equal(VESTING_DURATION);
        expect(await wallet.initTimestamp()).to.equal(initTimestamp);
    });

    it("fails to create a new time locked wallet with zero amount", async function () {
        await expect(timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, GROUP_ID, 0, TGE_AMOUNT, CLIFF_DURATION, VESTING_DURATION, initTimestamp))
            .to.be.revertedWith("Total amount must be greater than zero");
    });

    it("fails to create a new time locked wallet with TGE amount greater than total amount", async function () {
        await expect(timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, GROUP_ID, 10, 100, CLIFF_DURATION, VESTING_DURATION, initTimestamp))
            .to.be.revertedWith("TGE amount must not be greater then total amount");
    });

    it("sets the token address", async function () {
        await timeLockedWalletFactory.setTokenAddress(randomAddress.address);
        expect(await timeLockedWalletFactory.tokenAddress()).to.equal(randomAddress.address);
    });

    it("sets the time locked wallet address", async function () {
        await timeLockedWalletFactory.setTLWAddress(randomAddress.address);
        expect(await timeLockedWalletFactory.tlwAddress()).to.equal(randomAddress.address);
    });

    it("gets the wallets of a user", async function () {
        await timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, GROUP_ID, TOTAL_AMOUNT, TGE_AMOUNT, CLIFF_DURATION, VESTING_DURATION, initTimestamp);
        const wallets = await timeLockedWalletFactory.getWallets(tlwOwner.address, GROUP_ID);
        expect(wallets.length).to.equal(1);
    });
});
