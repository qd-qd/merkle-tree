// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleAirdrop {
    // The root hash of the Merkle tree we previously generated in our JavaScript code.
    // Remember to provide this as a bytes32 type and not a string. 0x should be prepended
    bytes32 public immutable merkleRoot;

    // Dummy events that would be used to modify the state of blockchain at low cost
    // It is required to benchmark gas consumption.
    event True();
    event False();

    constructor(bytes32 _merkleRoot) {
        merkleRoot = _merkleRoot;
    }

    function isIncluded(address _eoa, bytes32[] calldata _merkleProof)
        external
    {
        // generate the leafs based on _eoa
        bytes32 leaf = keccak256(abi.encodePacked(_eoa));

        // verify the leaf is included in the merkle tree
        if (MerkleProof.verify(_merkleProof, merkleRoot, leaf)) emit True();
        else emit False();
    }
}
