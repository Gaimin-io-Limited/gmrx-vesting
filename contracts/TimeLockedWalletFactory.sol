// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import {ERC20, TimeLockedWallet} from "./TimeLockedWallet.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract TimeLockedWalletFactory is Ownable {

    mapping(address => address[]) wallets;
    address public _tokenAddress;
    address public _tlwAddress;

    constructor(address tokenAddress, address tlwAddress) Ownable(msg.sender) {
        setTokenAddress(tokenAddress);
        setTLWAddress(tlwAddress);
    }

    function getWallets(address user)
    public view onlyOwner returns (address[] memory) {
        return wallets[user];
    }

    function setTokenAddress(address tokenAddress)
    public onlyOwner {
        _tokenAddress = tokenAddress;
    }

    function setTLWAddress(address tlwAddress)
    public onlyOwner {
        _tlwAddress = tlwAddress;
    }

    function newTimeLockedWallet(address owner, uint totalAmount, uint firstDayAmount, uint cliffDuration, uint fullDuration, uint initTimestamp)
    public returns (address wallet) {
        _validateNewTimeLockedWallet(owner, totalAmount, firstDayAmount);

        ERC20 token = ERC20(_tokenAddress);
        require(totalAmount <= token.allowance(msg.sender, address(this)), "This factory contract should be approved to spend :totalAmount of tokens");

        wallet = Clones.clone(_tlwAddress);
        require(token.transferFrom(msg.sender, wallet, totalAmount), "Token transfer failed");
        TimeLockedWallet(wallet).initialize(owner, _tokenAddress, totalAmount, firstDayAmount, cliffDuration, fullDuration, initTimestamp);

        wallets[msg.sender].push(wallet);
        if (msg.sender != owner) {
            wallets[owner].push(wallet);
        }
        emit Created(wallet, msg.sender, owner, totalAmount, firstDayAmount, cliffDuration, fullDuration, initTimestamp);
    }

    function _validateNewTimeLockedWallet(address owner, uint totalAmount, uint firstDayAmount)
    private pure {
        require(owner != address(0), "Owner address is invalid");
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(firstDayAmount <= totalAmount, "First day amount must not be greater then total amount");
    }

    event Created(address wallet, address from, address to, uint totalAmount, uint firstDayAmount, uint cliffDuration, uint fullDuration, uint initTimestamp);

}
