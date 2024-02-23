# GMRX
GAIMIN's token, GMRX, is a utility token that is used within the GAIMIN ecosystem. It is used to incentivize gamers to contribute their computational resources to gaimin. cloud and is also used for purchasing in-game items and participating in the Gaimin Gladiators eSports platform.

# Vesting Smart Contracts in Solidity

This repository contains two Solidity smart contracts for implementing a vesting mechanism for releasing tokens gradually over a specified duration. The contracts are designed to be deployed on the BNB blockchain.

## TimeLockedWallet Contract

The TimeLockedWallet is a smart contract written in Solidity for the BNB blockchain. It is designed to lock a certain amount of ERC20 tokens for a specified period of time. The contract uses the OpenZeppelin library for secure and standardized contract development.

The `TimeLockedWallet` contract implements a time-based vesting mechanism for releasing tokens gradually over a specified duration. Key functionalities include:

- **Initialization**: Initialize the contract with parameters such as owner's address, token address, total locked amount, TGE (Token Generation Event) amount, cliff duration, vesting duration, and initialization timestamp.
- **Withdrawal**: Claim vested tokens based on the current time.
- **Ready to Withdraw**: Calculate the amount of tokens ready to be withdrawn based on the current time.
- **Remaining Amount**: Return the remaining locked tokens in the contract.
- **Validation**: Validate initialization parameters and ensure the contract is properly funded with tokens.
  
![Vesting chart](documentation/vesting_chart.png?raw=true)

## TimeLockedWalletFactory Contract

The `TimeLockedWalletFactory` contract serves as a factory for deploying new instances of the `TimeLockedWallet` contract. Key functionalities include:

- **Constructor**: Initialize the contract with addresses of the token contract and the TimeLockedWallet contract.
- **Creating New Wallets**: The `newTimeLockedWallet` function creates a new instance of the TimeLockedWallet contract, initialize it with specified parameters, and transfer tokens to it.
- **Withdrawal**: The `withdrawAll` function triggers the withdrawal of tokens from all wallets associated with their owner and a specific group ID.
- **Validation**: Validate parameters provided for creating a new TimeLockedWallet instance.
- **Wallet Tracking**: Keep track of wallets created by users based on their addresses and group IDs.

## Contract Interactions

- Sender interact with the `TimeLockedWalletFactory` contract to create new time-locked wallets and lock tokens on it.
- Each time-locked wallet created through the factory and associated with the user who created it (sender) and a group ID, allowing for organized management of multiple wallets.
- The `TimeLockedWallet` contract is responsible for managing the vesting schedule and allowing the owner to claim vested tokens over time.

![Flow diagram](documentation/vesting_factory_flow.png?raw=true)

## Contract Deployment

1. Deploy the `TimeLockedWallet` contract first.
2. Deploy the `TimeLockedWalletFactory` contract, specifying the addresses of the token contract and the `TimeLockedWallet` contract during deployment.

Deployment example could be found [here](/scripts/deploy.js).

## Usage

1. Deploy the `TimeLockedWalletFactory` contract specifying the addresses of the token contract and the `TimeLockedWallet` contract.
2. Use the `newTimeLockedWallet` function of the factory contract to create new time-locked wallets, specifying the owner, vesting parameters, and initial token allocation.
3. Interact with the created wallets to claim vested tokens over time using the `withdraw` function.

This repository provides a comprehensive overview of the functionality and usage of the vesting smart contracts implemented in Solidity.
