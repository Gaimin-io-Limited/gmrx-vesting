// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    address public _owner;
    address public _tokenAddress;

    uint public _totalAmount;
    uint public _firstDayAmount;
    uint public _lockedAmount;
    uint public _cliffDuration;
    uint public _fullDuration;
    uint public _initTimestamp;
    uint public _lastClaimedTimestamp;

    function initialize(address owner, address tokenAddress, uint totalAmount, uint firstDayAmount, uint cliffDuration, uint fullDuration, uint initTimestamp)
    public initializer {
        _validateInitialize(owner, tokenAddress, totalAmount, firstDayAmount);

        _owner = owner;
        _tokenAddress = tokenAddress;
        _totalAmount = totalAmount;
        _firstDayAmount = firstDayAmount;
        _lockedAmount = totalAmount - firstDayAmount;
        _cliffDuration = cliffDuration;
        _fullDuration = fullDuration;
        _initTimestamp = initTimestamp;
        _lastClaimedTimestamp = initTimestamp;
    }

    function readyToWithdraw()
    public view returns (uint amount) {
        uint currentTimestamp = block.timestamp;

        bool firstDayAmountWithdrawn = _lastClaimedTimestamp != _initTimestamp;

        if (currentTimestamp < _initTimestamp + _cliffDuration) {
            return firstDayAmountWithdrawn ? 0 : _firstDayAmount;
        }
        if (currentTimestamp >= _initTimestamp + _fullDuration) {
            return remainingAmount();
        }

        uint vestingRate = _lockedAmount / _fullDuration;

        uint timePassed = currentTimestamp - _lastClaimedTimestamp;
        return vestingRate * timePassed + (firstDayAmountWithdrawn ? 0 : _firstDayAmount);
    }

    function withdraw()
    public {
        uint withdrawAmount = readyToWithdraw();
        if (withdrawAmount == 0) {
            revert("Nothing to withdraw");
        }

        _lastClaimedTimestamp = block.timestamp;

        ERC20 token = ERC20(_tokenAddress);
        SafeERC20.safeTransfer(token, _owner, withdrawAmount);
        emit Withdrawal(withdrawAmount);
    }

    function remainingAmount() public view returns (uint amount) {
        return ERC20(_tokenAddress).balanceOf(address(this));
    }

    function _validateInitialize(address owner, address tokenAddress, uint totalAmount, uint firstDayAmount)
    private view {
        require(owner != address(0), "Owner address is invalid");
        require(totalAmount > 0, "Amount must be greater than zero");
        require(firstDayAmount <= totalAmount, "First day amount must not be greater then total amount");
        require(ERC20(tokenAddress).balanceOf(address(this)) == totalAmount, "Amount of tokens should already be transferred to this locked contract");
    }

    event Withdrawal(uint amount);

}
