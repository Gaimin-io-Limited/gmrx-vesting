// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TimeLockedWallet.sol";

contract TimeLockedWalletFactory is Ownable {

    mapping(address => address[]) wallets;
    address public tokenContract = 0x9037dD49BeD73b3b2a99fCE722d2F9207027Bc3e; // M_GMRX

    function getWallets(address user) public view returns (address[] memory) {
        return wallets[user];
    }

    function setTokenContract(address _tokenContract) public onlyOwner {
        tokenContract = _tokenContract;
    }

    function newTimeLockedWallet(address owner, uint amount, uint unlockTime) public returns (address wallet) {
        require(unlockTime > block.timestamp);
        ERC20 token = ERC20(tokenContract);
        require(token.allowance(msg.sender, address(this)) >= amount);

        wallet = address(new TimeLockedWallet(owner, tokenContract, amount, unlockTime));
        require(token.transferFrom(msg.sender, wallet, amount));
        wallets[msg.sender].push(wallet);
        if (msg.sender != owner) {
            wallets[owner].push(wallet);
        }
        Created(wallet, msg.sender, owner, block.timestamp, unlockTime, amount);
    }

    event Created(address wallet, address from, address to, uint createdAt, uint unlockTime, uint amount);
}
