// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

interface IGmrxRate {

    function currencyToRate(string memory currencyPair) external view returns (uint rate);

    function postRate(string memory currencyPair, uint rate) external;

}
