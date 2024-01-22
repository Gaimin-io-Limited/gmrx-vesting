// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    address public _owner;
    address public _tokenAddress;
    uint public _amount;
    uint public _lockedAmount;
    uint public _fullDuration;
    uint public _cliffDuration;
    uint public _initTimestamp;
    uint public _lastWithdrawalTimestamp;

    function initialize(address owner, address tokenAddress, uint amount,
        uint cliffDuration, uint fullDuration, uint initTimestamp) public initializer {
        _validateInitialize(owner, tokenAddress, amount, cliffDuration, fullDuration);
        _owner = owner;
        _tokenAddress = tokenAddress;
        _amount = amount;
        _lockedAmount = _amount;
        _cliffDuration = cliffDuration;
        _fullDuration = fullDuration;
        _initTimestamp = initTimestamp;
        _lastWithdrawalTimestamp = _initTimestamp;
    }

    function readyToWithdraw() public view returns (uint amount) {
        uint currentTime = block.timestamp;
        uint vestingRate = _amount / _fullDuration;
        if (currentTime < _initTimestamp + _cliffDuration) {
            return 0;
        }
        if (_lastWithdrawalTimestamp == _initTimestamp + _fullDuration) {
            return 0;
        }
        if (currentTime >= _initTimestamp + _fullDuration) {
            return _lockedAmount;
        }

        uint timePassed = currentTime - _lastWithdrawalTimestamp;
        return vestingRate * timePassed;
    }

    function withdraw() public {
        uint withdrawAmount = readyToWithdraw();
        if (withdrawAmount == 0) {
            revert("Nothing to withdraw");
        }

        uint currentTimestamp = block.timestamp;
        uint endTimestamp = _initTimestamp + _fullDuration;
        if (currentTimestamp >= endTimestamp) {
            _lastWithdrawalTimestamp = _initTimestamp + _fullDuration;
        } else {
            _lastWithdrawalTimestamp = currentTimestamp;
        }

        _lockedAmount = _lockedAmount - withdrawAmount;

        ERC20 token = ERC20(_tokenAddress);
        SafeERC20.safeTransfer(token, _owner, withdrawAmount);
        emit Withdrawal(withdrawAmount);
    }

    function _validateInitialize(address owner, address tokenAddress, uint amount,
        uint cliffDuration, uint fullDuration) private view {
        require(amount > 0, "Amount must be greater than zero");
        require(cliffDuration > 0, "First unlock time should be in the future");
        require(fullDuration > 0, "Unlock time should be in the future");
        require(owner != address(0), "Owner address is invalid");
        require(ERC20(tokenAddress).balanceOf(address(this)) == amount, "Amount of tokens should already be transferred to this locked contract");
    }

    event Withdrawal(uint amount);
}
