import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { default as whitelist } from "../data/whitelist.json";

function geneateMerkle() {
  // hash addresses to generate leaf nodes
  const leafsNodes = whitelist.map(ethers.utils.keccak256);

  // generate the merkle tree
  const merkleOptions = { sortPairs: true };

  // @DEV: Do not create unbalanced tree (!!)
  //       Refer to the note section in the documentation
  //       to understand why it's an issue.
  const merkleTree = new MerkleTree(
    leafsNodes,
    ethers.utils.keccak256,
    merkleOptions
  );

  // get the root hash of the merkleTree
  const rootHash = merkleTree.getRoot().toString("hex");

  // number of valid proof require to valid the merkleTree
  const proofLength = merkleTree.getProof(leafsNodes[0]).length;

  return {
    rootHash,
    leafsNodes,
    proofLength,
    // A Merkle Tree with n leaves has O(log2 n) sized proof
    generateProof: (address: string) =>
      merkleTree.getHexProof(ethers.utils.keccak256(address)),
  };
}

export default geneateMerkle;
