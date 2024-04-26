// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract GmrxRate is Ownable{

    mapping(string => uint) public currencyToRate;

    constructor(address _initialOwner) Ownable(_initialOwner) {

    }

    function postRate(string memory currencyCodes, uint rate) public onlyOwner{
        currencyToRate[currencyCodes] = rate;
    }

}
