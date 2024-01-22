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
    let TimeLockedWalletFactory, TimeLockedWallet, timeLockedWallet, Token, token, timeLockedWalletFactory, tokenOwner,
        tlwOwner, randomAddress;
    const amount = hre.ethers.BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const cliffDuration = 60 * 60 * 24 * 30; // 30 days
    const fullDuration = 60 * 60 * 24 * 365; // 1 year
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
        token.connect(tokenOwner).approve(timeLockedWalletFactory.address, amount);
    });

    it("creates a new time locked wallet and emit event", async function () {
        const newTimeLockedWalletTx = await timeLockedWalletFactory.connect(tokenOwner).newTimeLockedWallet(tlwOwner.address, amount, cliffDuration, fullDuration, initTimestamp);
        const receipt = await newTimeLockedWalletTx.wait();
        const walletAddress = receipt.events?.find(e => e.event === 'Created').args.wallet;

        await expect(newTimeLockedWalletTx)
            .to.emit(timeLockedWalletFactory, 'Created')
            .withArgs(walletAddress, tokenOwner.address, tlwOwner.address, amount, cliffDuration, fullDuration);
    });

    it("creates a new time locked wallet using clone method", async function () {
        const initialWalletsCount = (await timeLockedWalletFactory.getWallets(tokenOwner.address)).length;

        const tx = await timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, amount, cliffDuration, fullDuration, initTimestamp);
        const receipt = await tx.wait();
        const walletAddress = receipt.events?.find(e => e.event === 'Created').args.wallet;

        const newWalletsCount = (await timeLockedWalletFactory.getWallets(tokenOwner.address)).length;

        expect(newWalletsCount).to.equal(initialWalletsCount + 1);

        const wallet = TimeLockedWallet.attach(walletAddress);

        expect(await wallet._owner()).to.equal(tlwOwner.address);
        expect(await wallet._amount()).to.equal(amount);
        expect(await wallet._cliffDuration()).to.equal(cliffDuration);
        expect(await wallet._fullDuration()).to.equal(fullDuration);
        expect(await wallet._initTimestamp()).to.equal(initTimestamp);
    });

    it("fails to create a new time locked wallet with zero amount", async function () {
        await expect(timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, 0, cliffDuration, fullDuration, initTimestamp))
            .to.be.revertedWith("Amount should be at least 1");
    });

    it("fails to create a new time locked wallet with zero cliff duration", async function () {
        await expect(timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, amount, 0, fullDuration, initTimestamp))
            .to.be.revertedWith("First unlock time should be in the future");

    });

    it("fails to create a new time locked wallet with zero full duration", async function () {
        await expect(timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, amount, cliffDuration, 0, initTimestamp))
            .to.be.revertedWith("Unlock time should be in the future");
    });

    it("sets the token address", async function () {
        await timeLockedWalletFactory.setTokenAddress(randomAddress.address);
        expect(await timeLockedWalletFactory._tokenAddress()).to.equal(randomAddress.address);
    });

    it("sets the time locked wallet address", async function () {
        await timeLockedWalletFactory.setTLWAddress(randomAddress.address);
        expect(await timeLockedWalletFactory._tlwAddress()).to.equal(randomAddress.address);
    });

    it("gets the wallets of a user", async function () {
        await timeLockedWalletFactory.newTimeLockedWallet(tlwOwner.address, amount, cliffDuration, fullDuration, initTimestamp);
        const wallets = await timeLockedWalletFactory.getWallets(tlwOwner.address);
        expect(wallets.length).to.equal(1);
    });
});
