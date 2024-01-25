// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    address public _owner;
    address public _tokenAddress;
    uint public _totalAmount;
    uint public _lockedAmount;
    uint public _cliffDuration;
    uint public _fullDuration;
    uint public _initTimestamp;
    uint public _lastClaimedTimestamp;

    function initialize(address owner, address tokenAddress, uint amount, uint cliffDuration, uint fullDuration, uint initTimestamp)
    public initializer {
        _validateInitialize(owner, tokenAddress, amount);
        _owner = owner;
        _tokenAddress = tokenAddress;
        _totalAmount = amount;
        _lockedAmount = amount;
        _cliffDuration = cliffDuration;
        _fullDuration = fullDuration;
        _initTimestamp = initTimestamp;
        _lastClaimedTimestamp = initTimestamp;
    }

    function readyToWithdraw()
    public view returns (uint amount) {
        uint currentTimestamp = block.timestamp;

        if (currentTimestamp < _initTimestamp + _cliffDuration) {
            return 0;
        }
        if (currentTimestamp >= _initTimestamp + _fullDuration) {
            return lockedAmount();
        }

        uint vestingRate = _totalAmount / _fullDuration;

        uint timePassed = currentTimestamp - _lastClaimedTimestamp;
        return vestingRate * timePassed;
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

    function lockedAmount() public view returns (uint lockedAmount) {
        return ERC20(_tokenAddress).balanceOf(address(this));
    }

    function _validateInitialize(address owner, address tokenAddress, uint amount)
    private view {
        require(owner != address(0), "Owner address is invalid");
        require(amount > 0, "Amount must be greater than zero");
        require(ERC20(tokenAddress).balanceOf(address(this)) == amount, "Amount of tokens should already be transferred to this locked contract");
    }

    event Withdrawal(uint amount);

}
