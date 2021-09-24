// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TimeLockedWallet is Ownable {

    uint256 public _icoDate;

    constructor(address owner, uint256 unlockDate) {
        transferOwnership(owner);
        _icoDate = unlockDate;
    }

    // callable by owner only, after specified time
    function withdraw() onlyOwner public {
        require(block.timestamp >= _icoDate);
        //now send all the balance
        payable(msg.sender).transfer(address(this).balance);
        Withdrew(msg.sender, address(this).balance);
    }

    // callable by owner only, after specified time, only for Tokens implementing ERC20
    function withdrawTokens(address tokenContract) onlyOwner public {
        require(block.timestamp >= _icoDate);
        ERC20 token = ERC20(tokenContract);
        //now send all the token balance
        uint256 tokenBalance = token.balanceOf(address(this));
        token.transfer(owner(), tokenBalance);
        WithdrewTokens(tokenContract, msg.sender, tokenBalance);
    }

    function info() public view returns (address, uint256, uint256) {
        return (owner(), _icoDate, address(this).balance);
    }

    // keep all the ether sent to this address
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }

    event Received(address from, uint256 amount);
    event Withdrew(address to, uint256 amount);
    event WithdrewTokens(address tokenContract, address to, uint256 amount);
}
