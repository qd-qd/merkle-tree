// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IMerkleAirdrop {
    // Dummy events that would be used to modify the state of blockchain at low cost
    // It is required to benchmark gas consumption.
    event True();
    event False();

    // Error that checks if the number of proof passed by the user is a valid path
    error IncorrectNumberOfProof();

    /**
        @notice This function is used to verify if an address is included as leaf in the Merkle Tree
        @dev In production, don't let user pass arbitrary addresses. 
             In case of an airdrop for example, hash `msg.sender` directly
    */
    function isIncluded(address, bytes32[] calldata) external;
}

contract MerkleAirdrop is IMerkleAirdrop {
    // The root hash of the Merkle tree we previously generated in our JavaScript code.
    // Remember to provide this as a bytes32 type and not a string. 0x should be prepended
    bytes32 public immutable merkleRoot;

    // Number of proof someone have to pass to correctly verify the Merkle.
    // The number of proof passed to the verify function must be strict.
    // If someone sends less proof than the one specified, he is probably
    // trying to run a second preimage attack
    uint256 private immutable proofLength;

    constructor(bytes32 _merkleRoot, uint256 _proofLength) {
        merkleRoot = _merkleRoot;
        proofLength = _proofLength;
    }

    function isIncluded(address _eoa, bytes32[] calldata _merkleProof)
        external
    {
        if (_merkleProof.length != proofLength) revert IncorrectNumberOfProof();

        // generate the leafs based on _eoa
        bytes32 leaf = keccak256(abi.encodePacked(_eoa));

        // verify if the leaf is included in the merkle tree
        if (MerkleProof.verify(_merkleProof, merkleRoot, leaf)) emit True();
        else emit False();
    }
}
