// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract TimeLockedWallet is Initializable {

    struct LockBoxStruct {
        uint amount;
        uint unlockTime;
        bool paid;
    }

    modifier onlyOwner() {
        require(_owner == msg.sender, "Caller is not the owner");
        _;
    }

    address public _owner;
    address public _tokenContract;
    LockBoxStruct[] public _lockBoxStructs;

    function initialize(address owner, address tokenContract, uint amount,
        uint numberOfPeriods, uint firstUnlockTime, uint periodDuration) public initializer {
        _validateInitialize(owner, tokenContract, amount, numberOfPeriods, firstUnlockTime);
        _owner = owner;
        _tokenContract = tokenContract;
        uint periodAmount = amount / numberOfPeriods;
        for (uint i = 0; i < numberOfPeriods; i++) {
            LockBoxStruct memory box;
            box.amount = periodAmount;
            box.unlockTime = firstUnlockTime + i * periodDuration;
            box.paid = false;
            _lockBoxStructs.push(box);
        }
        LockBoxStruct storage lastBox = _lockBoxStructs[numberOfPeriods - 1];
        lastBox.amount = lastBox.amount + amount % numberOfPeriods;
    }

    function lockedAmount() public view returns (uint amount) {
        for (uint i = 0; i < _lockBoxStructs.length; i++) {
            LockBoxStruct memory box = _lockBoxStructs[i];
            if (box.paid == false) {
                amount = amount + box.amount;
            }
        }
        return amount;
    }

    function readyToWithdraw() public view returns (uint amount) {
        for (uint i = 0; i < _lockBoxStructs.length; i++) {
            LockBoxStruct memory box = _lockBoxStructs[i];
            if (box.unlockTime <= block.timestamp && box.paid == false) {
                amount = amount + box.amount;
            }
        }
        return amount;
    }

    function withdrawTokens() public onlyOwner {
        bool isTransferred = false;
        for (uint i = 0; i < _lockBoxStructs.length; i++) {
            LockBoxStruct storage box = _lockBoxStructs[i];
            if (box.unlockTime <= block.timestamp && box.paid == false) {
                ERC20 token = ERC20(_tokenContract);
                SafeERC20.safeTransfer(token, _owner, box.amount);
                emit WithdrewTokens(box.amount);
                box.paid = true;
                isTransferred = true;
            }
        }
        if (!isTransferred) {
            revert("Nothing to withdraw");
        }
    }

    function _validateInitialize(address owner, address tokenContract, uint amount,
        uint numberOfPeriods, uint firstUnlockTime) private view {
        require(!Address.isContract(owner), "Owner should be externally-owned account and not a contract");
        require(ERC20(tokenContract).balanceOf(address(this)) == amount, "Amount of tokens should already be transferred to this locked contract");
        require(numberOfPeriods > 0, "There should be at least 1 unlock time");
        require(firstUnlockTime > block.timestamp, "Unlock time should be in the future");
    }

    event WithdrewTokens(uint amount);

}
