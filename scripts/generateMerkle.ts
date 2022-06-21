import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import { default as whitelist } from "../data/whitelist.json";

function geneateMerkle() {
  // hash addresses to generate leaf nodes
  const leafsNodes = whitelist.map(ethers.utils.keccak256);

  // generate the merkle tree
  const merkleOptions = { sortPairs: true };
  const merkleTree = new MerkleTree(
    leafsNodes,
    ethers.utils.keccak256,
    merkleOptions
  );

  // get the root hash of the merkleTree
  const rootHash = merkleTree.getRoot().toString("hex");

  return {
    rootHash,
    leafsNodes,
    // A Merkle Tree with n leaves has O(log2 n) sized proof
    generateProof: (address: string) =>
      merkleTree.getHexProof(ethers.utils.keccak256(address)),
  };
}

export default geneateMerkle;
