// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IGmrxRate} from "./IGmrxRate.sol";

contract GmrxRate is Ownable, IGmrxRate {

    mapping(string => uint) public currencyToRate;

    constructor() Ownable(msg.sender) {}

    function postRate(string memory currencyPair, uint rate) external onlyOwner {
        currencyToRate[currencyPair] = rate;
    }

}
