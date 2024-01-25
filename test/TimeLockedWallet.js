const hre = require('hardhat');
const {time} = require("@nomicfoundation/hardhat-network-helpers");
const {solidity} = require('ethereum-waffle');
let expect;
const ethers = hre.ethers;
const BigNumber = ethers.BigNumber;

before(async function () {
    const chai = await import('chai');
    chai.use(solidity);
    expect = chai.expect;
});


describe('TimeLockedWallet', function () {
    let TimeLockedWallet, Token, timeLockedWallet, owner, token, sender;
    const amount = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const cliffDuration = 60 * 60 * 24 * 30; // 30 days
    const fullDuration = 60 * 60 * 24 * 365; // 1 year
    let initTimestamp;

    beforeEach(async function () {
        await hre.network.provider.request({
            method: "hardhat_reset"
        });
        TimeLockedWallet = await ethers.getContractFactory('TimeLockedWallet');
        Token = await ethers.getContractFactory('GMRX');
        [owner, sender] = await ethers.getSigners();
        timeLockedWallet = await TimeLockedWallet.deploy();
        token = await Token.connect(sender).deploy();

        await token.connect(sender).transfer(timeLockedWallet.address, amount);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, amount,
            cliffDuration, fullDuration, initTimestamp);
        return {timeLockedWallet, token, initTimestamp};
    });

    describe('Initialization', function () {
        it('should initialize with correct values', async function () {
            expect(await timeLockedWallet._owner()).to.equal(owner.address);
            expect(await timeLockedWallet._tokenAddress()).to.equal(token.address);
            expect((await timeLockedWallet._totalAmount()).eq(amount)).to.be.true;
            expect((await timeLockedWallet.lockedAmount()).eq(amount)).to.be.true;
            expect((await timeLockedWallet._cliffDuration()).eq(cliffDuration)).to.be.true;
            expect((await timeLockedWallet._fullDuration()).eq(fullDuration)).to.be.true;
            expect((await timeLockedWallet._initTimestamp()).eq(initTimestamp)).to.be.true;
        });
    });

    describe('Locked Amount', function () {
        it('should return full amount before cliff period', async function () {
            expect((await timeLockedWallet.lockedAmount()).eq(amount)).to.be.true;
        });

        it('should return zero after full duration withdrawal was made',
            async function () {
                await time.increaseTo(fullTimestamp());
                await timeLockedWallet.withdraw();
                expect((await timeLockedWallet.lockedAmount()).isZero()).to.be.true;
            });
    });

    describe('Ready To Withdraw', function () {
        it('should return zero before cliff period', async function () {
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.isZero()).to.be.true;
        });

        it('should return full amount after full duration', async function () {
            await time.increaseTo(fullTimestamp())
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.eq(amount)).to.be.true;
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
                expect((await token.balanceOf(owner.address)).isZero()).to.be.true;
                const withdrawTx = await timeLockedWallet.withdraw();

                expect(withdrawTx).to.emit(timeLockedWallet, 'Withdrawal').withArgs(amount);
                expect((await token.balanceOf(owner.address)).eq(amount)).to.be.true;
                expect((await timeLockedWallet.lockedAmount()).isZero()).to.be.true;
            });

        it('should withdraw part after cliff duration and remaining after full duration',
            async function () {
                const lastWithdrawal = await timeLockedWallet._lastClaimedTimestamp();
                expect((await token.balanceOf(owner.address)).isZero()).to.be.true;

                await time.increaseTo(cliffTimestamp())
                await timeLockedWallet.withdraw();
                const timePassed = (await timeLockedWallet._lastClaimedTimestamp()) - lastWithdrawal;
                let amountToBeWithdrawed = hre.ethers.BigNumber.from(vestingRate())
                    .mul(hre.ethers.BigNumber.from(timePassed)).toString();
                expect((await token.balanceOf(owner.address)).eq(amountToBeWithdrawed)).to.be.true;
                expect((await timeLockedWallet.lockedAmount()).eq(amount.sub(amountToBeWithdrawed))).to.be.true;

                await time.increaseTo(fullTimestamp())
                await timeLockedWallet.withdraw();
                expect((await token.balanceOf(owner.address)).toString()).to.equal((amount).toString());
            });
    });

    function vestingRate() {
        return amount.div(BigNumber.from(fullDuration))
    }

    function cliffTimestamp() {
        return BigNumber.from(initTimestamp + cliffDuration).toHexString()
    }

    function fullTimestamp() {
        return BigNumber.from(initTimestamp + fullDuration).toHexString();
    }
});

describe('TimeLockedWallet without cliff', function () {
    let TimeLockedWallet, Token, timeLockedWallet, owner, token, sender;
    const amount = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const cliffDuration = 0;
    const fullDuration = 60 * 60 * 24 * 30; // 1 month
    let initTimestamp;

    beforeEach(async function () {
        await hre.network.provider.request({
            method: "hardhat_reset"
        });
        TimeLockedWallet = await ethers.getContractFactory('TimeLockedWallet');
        Token = await ethers.getContractFactory('GMRX');
        [owner, sender] = await ethers.getSigners();
        timeLockedWallet = await TimeLockedWallet.deploy();
        token = await Token.connect(sender).deploy();

        await token.connect(sender).transfer(timeLockedWallet.address, amount);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, amount,
            cliffDuration, fullDuration, initTimestamp);
    });


    describe('Ready To Withdraw', function () {
        it('should return amount straight away', async function () {
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.gt(BigNumber.from(0))).to.be.true;
        });

    });

    describe('Withdraw', function () {
        it('should withdraw straight away', async function () {
            let ownerBalanceBefore = await token.balanceOf(owner.address);
            expect(ownerBalanceBefore.isZero()).to.be.true;

            await timeLockedWallet.withdraw();
            const timePassed = (await timeLockedWallet._lastClaimedTimestamp()) - initTimestamp;

            let amountToBeWithdrawed = vestingRate().mul(timePassed);
            let ownerBalance = await token.balanceOf(owner.address);

            expect(ownerBalance.eq(amountToBeWithdrawed)).to.be.true;
        });

    });

    function vestingRate() {
        return amount.div(BigNumber.from(fullDuration))
    }

});

describe('TimeLockedWallet without duration', function () {
    let TimeLockedWallet, Token, timeLockedWallet, owner, token, sender;
    const amount = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const cliffDuration = 0;
    const fullDuration = 0;
    let initTimestamp;

    beforeEach(async function () {
        await hre.network.provider.request({
            method: "hardhat_reset"
        });
        TimeLockedWallet = await ethers.getContractFactory('TimeLockedWallet');
        Token = await ethers.getContractFactory('GMRX');
        [owner, sender] = await ethers.getSigners();
        timeLockedWallet = await TimeLockedWallet.deploy();
        token = await Token.connect(sender).deploy();

        await token.connect(sender).transfer(timeLockedWallet.address, amount);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, amount,
            cliffDuration, fullDuration, initTimestamp);
    });


    describe('Ready To Withdraw', function () {
        it('should return full amount straight away', async function () {
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.eq(amount)).to.be.true;
        });
    });

    describe('Withdraw', function () {
        it('should withdraw full amount straight away', async function () {
            let ownerBalanceBefore = await token.balanceOf(owner.address);
            expect(ownerBalanceBefore.isZero()).to.be.true;

            await timeLockedWallet.withdraw();
            let ownerBalance = await token.balanceOf(owner.address);

            expect(ownerBalance.eq(amount)).to.be.true;
        });

    });

});


