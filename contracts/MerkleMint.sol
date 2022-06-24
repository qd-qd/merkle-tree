// SPDX-License-Identifier: MIT

pragma solidity >=0.8.9;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MerkleMint is ERC721 {
    // The root hash of the Merkle tree we previously generated in our JavaScript code.
    // Remember to provide this as a bytes32 type and not a string. 0x should be prepended
    bytes32 public immutable merkleRoot;

    // Number of proof someone have to pass to correctly verify the Merkle.
    // The number of proof passed to the verify function must be strict.
    // If someone sends less proof than the one specified, he is probably
    // trying to run a second preimage attack
    uint256 private immutable proofLength;

    // error triggered if the number of proof passed by the user isn't valid
    error IncorrectNumberOfProof();

    // error triggered if the verification of the Merkle Tree doesn't pass
    error NotIncluded();

    constructor(bytes32 _merkleRoot, uint256 _proofLength)
        ERC721("RANDOM JPEG", "JPEG")
    {
        merkleRoot = _merkleRoot;
        proofLength = _proofLength;
    }

    function mint(address _to, uint256 _id) external {
        _mint(_to, _id);
    }

    /// @dev For a real project, _to shoudn't be a argument. Please, use msg.sender
    function premint(
        address _to,
        uint256 _id,
        bytes32[] calldata _merkleProof
    ) external {
        if (_merkleProof.length != proofLength) revert IncorrectNumberOfProof();

        // generate the leafs based on _eoa
        bytes32 leaf = keccak256(abi.encodePacked(_to));

        if (MerkleProof.verify(_merkleProof, merkleRoot, leaf)) _mint(_to, _id);
        else revert NotIncluded();
    }
}
