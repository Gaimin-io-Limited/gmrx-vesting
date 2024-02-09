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
    let TimeLockedWallet, Token, timeLockedWallet, token, owner, sender;

    const TOTAL_AMOUNT = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const FIRST_DAY_AMOUNT = BigNumber.from('1000000000000000000000'); // 1000 GMRX
    const LOCKED_AMOUNT = TOTAL_AMOUNT.sub(FIRST_DAY_AMOUNT);
    const CLIFF_DURATION = 60 * 60 * 24 * 30; // 30 days
    const FULL_DURATION = 60 * 60 * 24 * 365; // 1 year
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

        await token.connect(sender).transfer(timeLockedWallet.address, TOTAL_AMOUNT);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, TOTAL_AMOUNT, FIRST_DAY_AMOUNT,
            CLIFF_DURATION, FULL_DURATION, initTimestamp);
        return {timeLockedWallet, token, initTimestamp};
    });

    describe('Initialization', function () {
        it('should initialize with correct values', async function () {
            expect(await timeLockedWallet.owner()).to.equal(owner.address);
            expect(await timeLockedWallet.tokenAddress()).to.equal(token.address);
            expect((await timeLockedWallet.totalAmount()).eq(TOTAL_AMOUNT)).to.be.true;
            expect((await timeLockedWallet.firstDayAmount()).eq(FIRST_DAY_AMOUNT)).to.be.true;
            expect((await timeLockedWallet.lockedAmount()).eq(LOCKED_AMOUNT)).to.be.true;
            expect((await timeLockedWallet.remainingAmount()).eq(TOTAL_AMOUNT)).to.be.true;
            expect((await timeLockedWallet.cliffDuration()).eq(CLIFF_DURATION)).to.be.true;
            expect((await timeLockedWallet.fullDuration()).eq(FULL_DURATION)).to.be.true;
            expect((await timeLockedWallet.initTimestamp()).eq(initTimestamp)).to.be.true;
        });
    });

    describe('Remaining amount', function () {
        it('should return full amount before cliff period', async function () {
            expect((await timeLockedWallet.remainingAmount()).eq(TOTAL_AMOUNT)).to.be.true;
        });

        it('should return zero after full duration withdrawal was made',
            async function () {
                await time.increaseTo(fullTimestamp());
                await timeLockedWallet.withdraw();
                expect((await timeLockedWallet.remainingAmount()).isZero()).to.be.true;
            });
    });

    describe('Ready To Withdraw', function () {
        it('should return fist day amount before cliff period', async function () {
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.eq(FIRST_DAY_AMOUNT)).to.be.true;
        });

        it('should return full amount after full duration', async function () {
            await time.increaseTo(fullTimestamp())
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.eq(TOTAL_AMOUNT)).to.be.true;
        });
    });

    describe('Withdraw', function () {
        it('should withdraw first day amount before cliff', async function () {
            expect((await token.balanceOf(owner.address)).isZero()).to.be.true;

            const withdrawTx = await timeLockedWallet.withdraw();

            expect(withdrawTx).to.emit(timeLockedWallet, 'Withdrawal').withArgs(FIRST_DAY_AMOUNT);
            expect((await token.balanceOf(owner.address)).eq(FIRST_DAY_AMOUNT)).to.be.true;
            expect((await timeLockedWallet.remainingAmount()).eq(LOCKED_AMOUNT)).to.be.true;
        });

        it('should withdraw full amount after full duration',
            async function () {
                await time.increaseTo(fullTimestamp())
                expect((await token.balanceOf(owner.address)).isZero()).to.be.true;
                const withdrawTx = await timeLockedWallet.withdraw();

                expect(withdrawTx).to.emit(timeLockedWallet, 'Withdrawal').withArgs(TOTAL_AMOUNT);
                expect((await token.balanceOf(owner.address)).eq(TOTAL_AMOUNT)).to.be.true;
                expect((await timeLockedWallet.remainingAmount()).isZero()).to.be.true;
            });

        it('should withdraw part after cliff duration and remaining after full duration',
            async function () {
                const lastWithdrawal = await timeLockedWallet.lastClaimedTimestamp();
                expect((await token.balanceOf(owner.address)).isZero()).to.be.true;

                await time.increaseTo(cliffTimestamp())
                await timeLockedWallet.withdraw();
                const timePassed = (await timeLockedWallet.lastClaimedTimestamp()) - lastWithdrawal;
                let amountToBeWithdrawed = hre.ethers.BigNumber.from(vestingRate())
                    .mul(hre.ethers.BigNumber.from(timePassed))
                    .add(FIRST_DAY_AMOUNT)
                    .toString();
                const q = await token.balanceOf(owner.address);
                expect((await token.balanceOf(owner.address)).eq(amountToBeWithdrawed)).to.be.true;
                expect((await timeLockedWallet.remainingAmount()).eq(TOTAL_AMOUNT.sub(amountToBeWithdrawed))).to.be.true;

                await time.increaseTo(fullTimestamp())
                await timeLockedWallet.withdraw();
                expect((await token.balanceOf(owner.address)).toString()).to.equal((TOTAL_AMOUNT).toString());
            });
    });

    function vestingRate() {
        return LOCKED_AMOUNT.div(BigNumber.from(FULL_DURATION))
    }

    function cliffTimestamp() {
        return BigNumber.from(initTimestamp + CLIFF_DURATION).toHexString()
    }

    function fullTimestamp() {
        return BigNumber.from(initTimestamp + FULL_DURATION).toHexString();
    }

});

describe('TimeLockedWallet without first day amount', function () {
    let TimeLockedWallet, Token, timeLockedWallet, token, owner, sender;

    const TOTAL_AMOUNT = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const FIRST_DAY_AMOUNT = BigNumber.from('0');
    const LOCKED_AMOUNT = TOTAL_AMOUNT.sub(FIRST_DAY_AMOUNT);
    const CLIFF_DURATION = 60 * 60 * 24 * 30; // 30 days
    const FULL_DURATION = 60 * 60 * 24 * 365; // 1 year
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

        await token.connect(sender).transfer(timeLockedWallet.address, TOTAL_AMOUNT);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, TOTAL_AMOUNT, FIRST_DAY_AMOUNT,
            CLIFF_DURATION, FULL_DURATION, initTimestamp);
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

                expect(withdrawTx).to.emit(timeLockedWallet, 'Withdrawal').withArgs(LOCKED_AMOUNT);
                expect((await token.balanceOf(owner.address)).eq(LOCKED_AMOUNT)).to.be.true;
                expect((await timeLockedWallet.remainingAmount()).isZero()).to.be.true;
            });

        it('should withdraw part after cliff duration and remaining after full duration',
            async function () {
                const lastWithdrawal = await timeLockedWallet.lastClaimedTimestamp();
                expect((await token.balanceOf(owner.address)).isZero()).to.be.true;

                await time.increaseTo(cliffTimestamp())
                await timeLockedWallet.withdraw();
                const timePassed = (await timeLockedWallet.lastClaimedTimestamp()) - lastWithdrawal;
                let amountToBeWithdrawed = hre.ethers.BigNumber.from(vestingRate())
                    .mul(hre.ethers.BigNumber.from(timePassed)).toString();
                expect((await token.balanceOf(owner.address)).eq(amountToBeWithdrawed)).to.be.true;
                expect((await timeLockedWallet.remainingAmount()).eq(LOCKED_AMOUNT.sub(amountToBeWithdrawed))).to.be.true;

                await time.increaseTo(fullTimestamp())
                await timeLockedWallet.withdraw();
                expect((await token.balanceOf(owner.address)).toString()).to.equal((LOCKED_AMOUNT).toString());
            });
    });

    function vestingRate() {
        return LOCKED_AMOUNT.div(BigNumber.from(FULL_DURATION))
    }

    function cliffTimestamp() {
        return BigNumber.from(initTimestamp + CLIFF_DURATION).toHexString()
    }

    function fullTimestamp() {
        return BigNumber.from(initTimestamp + FULL_DURATION).toHexString();
    }

});

describe('TimeLockedWallet without cliff', function () {
    let TimeLockedWallet, Token, timeLockedWallet, token, owner, sender;

    const TOTAL_AMOUNT = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const FIRST_DAY_AMOUNT = BigNumber.from('1000000000000000000000'); // 1000 GMRX
    const LOCKED_AMOUNT = TOTAL_AMOUNT.sub(FIRST_DAY_AMOUNT);
    const CLIFF_DURATION = 0;
    const FULL_DURATION = 60 * 60 * 24 * 30; // 1 month
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

        await token.connect(sender).transfer(timeLockedWallet.address, TOTAL_AMOUNT);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, TOTAL_AMOUNT, FIRST_DAY_AMOUNT,
            CLIFF_DURATION, FULL_DURATION, initTimestamp);
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
            const timePassed = (await timeLockedWallet.lastClaimedTimestamp()) - initTimestamp;

            let amountToBeWithdrawed = vestingRate().mul(timePassed).add(FIRST_DAY_AMOUNT);
            let ownerBalance = await token.balanceOf(owner.address);

            expect(ownerBalance.eq(amountToBeWithdrawed)).to.be.true;
        });
    });

    function vestingRate() {
        return LOCKED_AMOUNT.div(BigNumber.from(FULL_DURATION))
    }

});

describe('TimeLockedWallet without duration', function () {
    let TimeLockedWallet, Token, timeLockedWallet, token, owner, sender;

    const TOTAL_AMOUNT = BigNumber.from('10000000000000000000000'); // 10000 GMRX
    const FIRST_DAY_AMOUNT = BigNumber.from('1000000000000000000000'); // 1000 GMRX
    const CLIFF_DURATION = 0;
    const FULL_DURATION = 0;
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

        await token.connect(sender).transfer(timeLockedWallet.address, TOTAL_AMOUNT);

        initTimestamp = await time.latest();
        await timeLockedWallet.initialize(owner.address, token.address, TOTAL_AMOUNT, FIRST_DAY_AMOUNT,
            CLIFF_DURATION, FULL_DURATION, initTimestamp);
    });


    describe('Ready To Withdraw', function () {
        it('should return full amount straight away', async function () {
            let readyToWithdraw = await timeLockedWallet.readyToWithdraw();
            expect(readyToWithdraw.eq(TOTAL_AMOUNT)).to.be.true;
        });
    });

    describe('Withdraw', function () {
        it('should withdraw full amount straight away', async function () {
            let ownerBalanceBefore = await token.balanceOf(owner.address);
            expect(ownerBalanceBefore.isZero()).to.be.true;

            await timeLockedWallet.withdraw();
            let ownerBalance = await token.balanceOf(owner.address);

            expect(ownerBalance.eq(TOTAL_AMOUNT)).to.be.true;
        });
    });

});


