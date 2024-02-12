// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    address public owner;
    address public tokenAddress;

    uint public firstDayAmount;
    uint public lockedAmount;
    uint public cliffDuration;
    uint public fullDuration;
    uint public initTimestamp;
    uint public lastClaimedTimestamp;

    function initialize(address owner_, address tokenAddress_, uint totalAmount_, uint firstDayAmount_, uint cliffDuration_, uint fullDuration_, uint initTimestamp_)
    public initializer {
        _validateInitialize(owner_, tokenAddress_, totalAmount_, firstDayAmount_);

        owner = owner_;
        tokenAddress = tokenAddress_;
        firstDayAmount = firstDayAmount_;
        lockedAmount = totalAmount_ - firstDayAmount_;
        cliffDuration = cliffDuration_;
        fullDuration = fullDuration_;
        initTimestamp = initTimestamp_;
        lastClaimedTimestamp = initTimestamp_;
    }

    function readyToWithdraw()
    public view returns (uint) {
        uint currentTimestamp = block.timestamp;

        if (currentTimestamp < initTimestamp) {
            return 0;
        }

        uint firstDayAmount_ = lastClaimedTimestamp != initTimestamp ? 0 : firstDayAmount;

        if (currentTimestamp < initTimestamp + cliffDuration) {
            return firstDayAmount_;
        }
        if (currentTimestamp >= initTimestamp + fullDuration) {
            return remainingAmount();
        }

        uint vestingRate = lockedAmount / fullDuration;
        uint timePassed = currentTimestamp - lastClaimedTimestamp;
        return vestingRate * timePassed + firstDayAmount_;
    }

    function withdraw()
    public {
        uint withdrawAmount = readyToWithdraw();
        if (withdrawAmount == 0) {
            revert("Nothing to withdraw");
        }

        lastClaimedTimestamp = block.timestamp;

        ERC20 token = ERC20(tokenAddress);
        SafeERC20.safeTransfer(token, owner, withdrawAmount);
        emit Withdrawal(withdrawAmount);
    }

    function remainingAmount() public view returns (uint) {
        return ERC20(tokenAddress).balanceOf(address(this));
    }

    function _validateInitialize(address owner_, address tokenAddress_, uint totalAmount_, uint firstDayAmount_)
    private view {
        require(owner_ != address(0), "Owner address is invalid");
        require(totalAmount_ > 0, "Amount must be greater than zero");
        require(firstDayAmount_ <= totalAmount_, "First day amount must not be greater then total amount");
        require(ERC20(tokenAddress_).balanceOf(address(this)) == totalAmount_, "Amount of tokens should already be transferred to this locked contract");
    }

    event Withdrawal(uint amount);

}
