const hre = require('hardhat');
const {time} = require("@nomicfoundation/hardhat-network-helpers");
const {solidity} = require('ethereum-waffle');
let expect;

before(async function () {
    const chai = await import('chai');
    chai.use(solidity);
    expect = chai.expect;
});

describe('TimeLockedWallet', function () {
    let TimeLockedWallet, Token, timeLockedWallet, owner, token, sender;
    const amount = hre.ethers.BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const cliffDuration = 60 * 60 * 24 * 30; // 30 days
    const fullDuration = 60 * 60 * 24 * 365; // 1 year
    let initTimestamp;

    beforeEach(async function () {
        await hre.network.provider.request({
            method: "hardhat_reset"
        });
        TimeLockedWallet = await hre.ethers.getContractFactory('TimeLockedWallet');
        Token = await hre.ethers.getContractFactory('GMRX');
        [owner, sender] = await hre.ethers.getSigners();
        timeLockedWallet = await TimeLockedWallet.deploy();
        token = await Token.connect(sender).deploy();

        await token.connect(sender).transfer(timeLockedWallet.address, amount);

        initTimestamp = (await time.latest());
        await timeLockedWallet.initialize(owner.address, token.address, amount,
            cliffDuration, fullDuration, initTimestamp);
    });

    describe('Initialization', function () {
        it('should initialize with correct values', async function () {
            expect(await timeLockedWallet._owner()).to.equal(owner.address);
            expect(await timeLockedWallet._tokenAddress()).to.equal(token.address);
            expect((await timeLockedWallet._totalAmount()).toString()).to.equal(amount.toString());
            expect((await timeLockedWallet._lockedAmount()).toString()).to.equal(amount.toString());
            expect((await timeLockedWallet._cliffDuration()).toNumber()).to.equal(cliffDuration);
            expect((await timeLockedWallet._fullDuration()).toNumber()).to.equal(fullDuration);
            expect((await timeLockedWallet._initTimestamp()).toNumber()).to.equal(initTimestamp);
        });
    });

    describe('Locked Amount', function () {
        it('should return full amount before cliff period', async function () {
            expect((await timeLockedWallet._lockedAmount()).toString()).to.equal(amount.toString());
        });

        it('should return zero after full duration withdrawal was made',
            async function () {
                await time.increaseTo(fullTimestamp());
                await timeLockedWallet.withdraw();
                expect((await timeLockedWallet._lockedAmount()).toString()).to.equal('0');
            });
    });

    describe('Ready To Withdraw', function () {
        it('should return zero before cliff period', async function () {
            expect((await timeLockedWallet.readyToWithdraw()).toString()).to.equal('0');
        });

        it('should return full amount after full duration', async function () {
            await time.increaseTo(fullTimestamp())
            expect((await timeLockedWallet.readyToWithdraw()).toString()).to.equal(amount.toString());
        });
    });

    describe('Withdraw', function () {
        it('should revert before cliff period', async function () {
            try {
                await timeLockedWallet.withdraw();
                expect.fail('Expected withdraw function to throw');
            } catch (err) {
                expect(err.message).to.contain('Nothing to withdraw');
            }
        });

        it('should withdraw full amount after full duration',
            async function () {
                await time.increaseTo(fullTimestamp())
                expect((await token.balanceOf(owner.address)).toString()).to.equal('0');
                const withdrawTx = await timeLockedWallet.withdraw();

                expect(withdrawTx).to.emit(timeLockedWallet, 'Withdrawal').withArgs(amount);
                expect((await token.balanceOf(owner.address)).toString()).to.equal(amount.toString());
                expect((await timeLockedWallet._lockedAmount()).toString()).to.equal('0');
            });

        it('should withdraw part after cliff duration and remaining after full duration',
            async function () {
                const lastWithdrawal = await timeLockedWallet._lastClaimedTimestamp();
                expect((await token.balanceOf(owner.address)).toString()).to.equal('0');

                await time.increaseTo(cliffTimestamp())
                await timeLockedWallet.withdraw();
                const timePassed = (await timeLockedWallet._lastClaimedTimestamp()) - lastWithdrawal;
                let amountToBeWithdrawed = hre.ethers.BigNumber.from(vestingRate())
                    .mul(hre.ethers.BigNumber.from(timePassed)).toString();
                expect((await token.balanceOf(owner.address)).toString()).to.equal(amountToBeWithdrawed);
                expect((await timeLockedWallet._lockedAmount()).toString()).to.equal(hre.ethers.BigNumber.from(amount)
                    .sub(amountToBeWithdrawed).toString());

                await time.increaseTo(fullTimestamp())
                await timeLockedWallet.withdraw();
                expect((await token.balanceOf(owner.address)).toString()).to.equal((amount).toString());
            });
    });

    function vestingRate() {
        return amount.div(hre.ethers.BigNumber.from(fullDuration))
    }

    function cliffTimestamp() {
        return hre.ethers.BigNumber.from(
            initTimestamp + cliffDuration).toHexString()
    }

    function fullTimestamp() {
        return hre.ethers.BigNumber.from(
            initTimestamp + fullDuration).toHexString();
    }
});
