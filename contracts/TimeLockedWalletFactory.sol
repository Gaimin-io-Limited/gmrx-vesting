// SPDX-License-Identifier: MIT

pragma solidity 0.8.23;

import {ERC20, TimeLockedWallet} from "./TimeLockedWallet.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract TimeLockedWalletFactory is Ownable {

    mapping(address => mapping(uint => address[])) public wallets;

    address public tokenAddress;
    address public tlwAddress;

    constructor(address tokenAddress_, address tlwAddress_) Ownable(msg.sender) {
        setTokenAddress(tokenAddress_);
        setTLWAddress(tlwAddress_);
    }

    function getWallets(address user, uint groupId)
    public view returns (address[] memory) {
        return wallets[user][groupId];
    }

    function setTokenAddress(address tokenAddress_)
    public onlyOwner {
        tokenAddress = tokenAddress_;
    }

    function setTLWAddress(address tlwAddress_)
    public onlyOwner {
        tlwAddress = tlwAddress_;
    }

    function newTimeLockedWallet(address owner, uint groupId, uint totalAmount, uint tgeAmount, uint cliffDuration, uint fullDuration, uint initTimestamp)
    public returns (address wallet) {
        _validateNewTimeLockedWallet(owner, totalAmount, tgeAmount);

        ERC20 token = ERC20(tokenAddress);
        require(totalAmount <= token.allowance(msg.sender, address(this)), "This factory contract should be approved to spend :totalAmount of tokens");

        wallet = Clones.clone(tlwAddress);
        require(token.transferFrom(msg.sender, wallet, totalAmount), "Token transfer failed");
        TimeLockedWallet(wallet).initialize(owner, tokenAddress, totalAmount, tgeAmount, cliffDuration, fullDuration, initTimestamp);

        wallets[msg.sender][groupId].push(wallet);
        if (msg.sender != owner) {
            wallets[owner][groupId].push(wallet);
        }
        emit Created(wallet, msg.sender, owner, groupId, totalAmount, tgeAmount, cliffDuration, fullDuration, initTimestamp);
    }

    function withdrawAll(address owner, uint groupId)
    public {
        for (uint i = 0; i < wallets[owner][groupId].length; i++) {
            TimeLockedWallet(wallets[owner][groupId][i]).withdraw();
        }
    }

    function _validateNewTimeLockedWallet(address owner, uint totalAmount, uint tgeAmount)
    private pure {
        require(owner != address(0), "Owner address is invalid");
        require(totalAmount > 0, "Total amount must be greater than zero");
        require(tgeAmount <= totalAmount, "TGE amount must not be greater then total amount");
    }

    event Created(address wallet, address from, address to, uint groupId, uint totalAmount, uint tgeAmount, uint cliffDuration, uint fullDuration, uint initTimestamp);

}
