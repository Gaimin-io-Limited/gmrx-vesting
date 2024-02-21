// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    address public owner;
    address public tokenAddress;

    uint public tgeAmount;
    uint public lockedAmount;
    uint public cliffDuration;
    uint public vestingDuration;
    uint public initTimestamp;
    uint public lastClaimedTimestamp;

    function initialize(address owner_, address tokenAddress_, uint totalAmount_, uint tgeAmount_, uint cliffDuration_, uint vestingDuration_, uint initTimestamp_)
    public initializer {
        _validateInitialize(owner_, tokenAddress_, totalAmount_, tgeAmount_);

        owner = owner_;
        tokenAddress = tokenAddress_;
        tgeAmount = tgeAmount_;
        lockedAmount = totalAmount_ - tgeAmount_;
        cliffDuration = cliffDuration_;
        vestingDuration = vestingDuration_;
        initTimestamp = initTimestamp_;
        lastClaimedTimestamp = initTimestamp_;
    }

    function readyToWithdraw()
    public view returns (uint) {
        uint currentTimestamp = block.timestamp;

        if (currentTimestamp < initTimestamp) {
            return 0;
        }

        uint cliffEndTimestamp = initTimestamp + cliffDuration;
        uint tgeAmount_ = lastClaimedTimestamp != initTimestamp ? 0 : tgeAmount;

        if (currentTimestamp < cliffEndTimestamp) {
            return tgeAmount_;
        }
        if (currentTimestamp >= initTimestamp + cliffDuration + vestingDuration) {
            return remainingAmount();
        }

        uint vestingRate = lockedAmount / vestingDuration;
        uint timePassed = currentTimestamp - (lastClaimedTimestamp > cliffEndTimestamp ? lastClaimedTimestamp : cliffEndTimestamp);
        return vestingRate * timePassed + tgeAmount_;
    }

    function withdraw()
    public {
        uint withdrawAmount = readyToWithdraw();
        if (withdrawAmount == 0) {
            return;
        }

        lastClaimedTimestamp = block.timestamp;

        ERC20 token = ERC20(tokenAddress);
        SafeERC20.safeTransfer(token, owner, withdrawAmount);
        emit Withdrawal(withdrawAmount);
    }

    function remainingAmount() public view returns (uint) {
        return ERC20(tokenAddress).balanceOf(address(this));
    }

    function _validateInitialize(address owner_, address tokenAddress_, uint totalAmount_, uint tgeAmount_)
    private view {
        require(owner_ != address(0), "Owner address is invalid");
        require(totalAmount_ > 0, "Amount must be greater than zero");
        require(tgeAmount_ <= totalAmount_, "TGE amount must not be greater then total amount");
        require(ERC20(tokenAddress_).balanceOf(address(this)) == totalAmount_, "Amount of tokens should already be transferred to this locked contract");
    }

    event Withdrawal(uint amount);

}
