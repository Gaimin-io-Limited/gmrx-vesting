// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Initializable} from "@openzeppelin/contracts/proxy/utils/Initializable.sol";

contract EngagementPortalBank is Initializable, Ownable {

    struct UserDto {
        address addr;
        uint128 totalAmount;
    }

    struct UserData {
        uint128 totalAmount;
        uint128 claimedAmount;
    }

    mapping(address => UserData) public users;

    address public tokenAddress;

    uint public tgeAmountPercent;
    uint public vestingDuration;
    uint public initTimestamp;

    constructor() Ownable(msg.sender) {}

    function initialize(address tokenAddress_, uint tgeAmountPercent_, uint vestingDuration_, uint initTimestamp_)
    public initializer onlyOwner {
        tokenAddress = tokenAddress_;

        tgeAmountPercent = tgeAmountPercent_;
        vestingDuration = vestingDuration_;
        initTimestamp = initTimestamp_;
    }

    function createUsers(UserDto[] calldata _users)
    public onlyOwner {
        uint totalAmount;
        uint arrayLength = _users.length;
        for (uint i; i < arrayLength; i++) {
            users[_users[i].addr] = UserData(_users[i].totalAmount, 0);
            totalAmount += _users[i].totalAmount;
        }

        if (!ERC20(tokenAddress).transferFrom(_msgSender(), address(this), totalAmount)) {
            revert("Token transfer failed");
        }
    }

    function readyToClaim(address userAddr)
    public view returns (uint) {
        uint currentTimestamp = block.timestamp;
        if (currentTimestamp < initTimestamp) {
            return 0;
        }

        uint totalAmount = users[userAddr].totalAmount;
        uint claimedAmount = users[userAddr].claimedAmount;
        if (currentTimestamp >= initTimestamp + vestingDuration) {
            return totalAmount - claimedAmount;
        }

        uint tgeAmount = totalAmount / 100 * tgeAmountPercent;
        uint lockedAmount = totalAmount - tgeAmount;

        uint vestingRate = lockedAmount / vestingDuration;
        uint timePassed = currentTimestamp - initTimestamp;

        return tgeAmount + vestingRate * timePassed - claimedAmount;
    }

    function claim()
    public {
        uint claimAmount = readyToClaim(_msgSender());
        if (claimAmount == 0) {
            revert("There is nothing to claim");
        }

        users[_msgSender()].claimedAmount += uint128(claimAmount);

        ERC20 token = ERC20(tokenAddress);
        token.transfer(_msgSender(), claimAmount);

        emit Withdrawal(_msgSender(), claimAmount);
    }

    function withdrawAll(address recipient)
    public onlyOwner {
        uint currentTimestamp = block.timestamp;
        if (currentTimestamp <= initTimestamp + vestingDuration + 30 days) {
            revert("You cannot withdraw all yet");
        }

        ERC20 token = ERC20(tokenAddress);
        uint withdrawAmount = token.balanceOf(address(this));
        token.transfer(recipient, withdrawAmount);

        emit Withdrawal(recipient, withdrawAmount);
    }

    event Withdrawal(address recipient, uint amount);

}
