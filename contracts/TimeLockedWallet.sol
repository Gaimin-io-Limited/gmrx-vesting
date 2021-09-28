// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimeLockedWallet is Ownable {

    struct LockBoxStruct {
        uint amount;
        uint unlockTime;
        bool paid;
    }

    address public tokenContract;
    LockBoxStruct[] lockBoxStructs;

    constructor(address _owner, address _tokenContract, uint _amount, uint _unlockTime) {
        transferOwnership(_owner);
        tokenContract = _tokenContract;
        LockBoxStruct memory box;
        box.amount = _amount;
        box.unlockTime = _unlockTime;
        box.paid = false;
        lockBoxStructs.push(box);
    }

    function lockedAmount() public view returns (uint amount) {
        for (uint i = 0; i < lockBoxStructs.length; i++) {
            LockBoxStruct memory box = lockBoxStructs[i];
            if (box.paid == false) {
                amount = amount + box.amount;
            }
        }
        return amount;
    }

    function info() public view returns (address, LockBoxStruct[] memory) {
        return (tokenContract, lockBoxStructs);
    }

    function withdrawTokens() public onlyOwner {
        for (uint i = 0; i < lockBoxStructs.length; i++) {
            LockBoxStruct storage box = lockBoxStructs[i];
            if (box.unlockTime <= block.timestamp) {
                if (box.paid == false) {
                    ERC20 token = ERC20(tokenContract);
                    token.transfer(owner(), box.amount);
                    emit WithdrewTokens(box.amount);
                    box.paid = true;
                }
            } else {
                emit LockedFunds(box.amount, box.unlockTime);
            }
        }
    }

    event WithdrewTokens(uint amount);
    event LockedFunds(uint amount, uint unlockTime);

}
