// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./TimeLockedWallet.sol";

contract TimeLockedWalletFactory {

    mapping(address => address[]) wallets;

    function getWallets(address user) public view returns (address[] memory) {
        return wallets[user];
    }

    function newTimeLockedWallet(address owner, uint256 icoDate) public returns (address wallet) {
        require(icoDate > block.timestamp);
        wallet = new TimeLockedWallet(owner, icoDate);
        wallets[owner].push(wallet);
        Created(wallet, msg.sender, owner, block.timestamp, icoDate, msg.value);
    }

    event Created(address wallet, address from, address to, uint256 createdAt, uint256 icoDate, uint256 amount);
}
