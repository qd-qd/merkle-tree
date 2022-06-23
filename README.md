# Merkle experimentation for airdrop

## Introduction

This repository is an experimentation that shows how Merkle Trees work, and how they can be used for pre-sale mint and airdrop process'. The code in this repository is not production-ready. Please, take into consideration concerns and comments in the [note](#notes) section before using it in production.

[![Watch the video](https://img.youtube.com/vi/YIc6MNfv5iQ/maxresdefault.jpg)](https://www.youtube.com/watch?v=YIc6MNfv5iQ)
<p align="center">
    Watch this introduction to understand how Merkle Trees enable the decentralized web
</p>

## Installation

First, install all the dependencies needed

```shell
npm i
```

Then, generate a fake whitelist by running this command

```shell
npm run whitelist:generate
```

By default, the whitelist will contain 2046 addresses. If you want to customize the number of addresses that should be generated, create a `.env` file at the root of the project and set the desired value to the variable called `NUMBER_OF_ADRESSES_TO_GENERATE`

## Test

You can run the tests by running this command

```shell
npm run test
```

You can generate a gas report by running this dedicated command

```shell
npm run test:gas
```

## Gas snapshots

Below, are snapshots taken during a gas consumption benchmark. Keep in mind the gas cost snapshotted includes the cost of triggering an event (375 gas in that case), and the base cost (21,000 of gas). If you want to exactly know how the Merkle process cost, you have to subtract these costs.  More info [here](https://github.com/wolflo/evm-opcodes/blob/main/gas.md)

**This benchmark was made with a Merkle tree that contains 10 addresses**

![gas consumption of the verify function when passing a Merkle tree of 10 addresses](docs/cost-merkle-10-addresses.png)

**This benchmark was made with a Merkle tree that contains 200 addresses**

![gas consumption of the verify function when passing a Merkle tree of 200 addresses](docs/cost-merkle-200-addresses.png)

**This benchmark was made with a Merkle tree that contains 2,046 addresses**

![gas consumption of the verify function when passing a Merkle tree of 2,046 addresses](docs/cost-merkle-2046-addresses.png)

**This benchmark was made with a Merkle tree that contains 10,000 addresses**

![gas consumption of the verify function when passing a Merkle tree of 10,000 addresses](docs/cost-merkle-10000-addresses.png)

## Notes

A Merkle Tree with n leaves has O(log2 n) sized proofs. That explains the result of the benchmarks above.

This implementation checks three depths, meaning that an attacker can’t just supply intermediate values directly. That means this implementation is protected against the [second pre-image attack](https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack) attack. If you want to protect against this attack without checking the three depths, one of the solutions is to differentiate between leaf nodes and intermediate nodes in the tree by prepending a different byte value for leaf and intermediate nodes (such as 0x00 and 0x01 as in the certificate transparency implementation).  More info about the attack [here](https://flawed.net.nz/2018/02/21/attacking-merkle-trees-with-a-second-preimage-attack/)


Also, as is, this implementation is vulnerable to a forgery attack for an unbalanced tree, where the last leaf node can be duplicated to create an artificial balanced tree, resulting in the same Merkle root hash. Do not accept unbalanced trees to prevent this. One solution would be to populate the tree until it is balanced by using the hash of the address(0) or any dumb data that can't be provided (if you hash `msg.sender` value in your Solidity function, address(0) sounds a great contender as no one can control the private key of this address). One example of this attack [here](https://bitcointalk.org/?topic=102395).

## Ressources

[A Digital Signature Based on a Conventional Encryption Function](https://people.eecs.berkeley.edu/~raluca/cs261-f15/readings/merkle.pdf2)

[Preimage Attacks on Round-reduced Keccak -224/256 via an Allocating Approach](https://eprint.iacr.org/2019/248.pdf)

[What is a preimage attack](https://www.comparitech.com/blog/information-security/what-is-preimage-attack/#Cryptographic_hash_function_basics)

[Wikipedia: Merkle Tree](https://en.wikipedia.org/wiki/Merkle_tree)

[Brilliant.org: Merkle Tree](https://brilliant.org/wiki/merkle-tree/)

[Medium: Techskill Brew](https://medium.com/techskill-brew/merkle-tree-in-blockchain-part-5-blockchain-basics-4e25b61179a2)
