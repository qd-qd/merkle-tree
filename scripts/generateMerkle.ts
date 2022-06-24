import { MerkleTree } from "merkletreejs";
import { ethers } from "ethers";
import * as dotenv from "dotenv";
import isNPowerOfTwo from "../utils/isNPowerOfTwo";
import makeListLengthPowerOfTwo from "../utils/makeListLengthPowerOfTwo";

// load .env
dotenv.config();

function geneateMerkle(addresses: Array<string>) {
  if (addresses.length === 0) throw new Error("no data to merkle");

  // clone the list of addresses because we may mutate it later
  let data = [...addresses];

  // check if we need to add some placeholder data to make the tree balanced
  // if the length of the data isn't a power of two, we'll have to push data to the list
  // to avoid construct an unbalanced tree
  const isPowerOfTwo = isNPowerOfTwo(addresses.length);

  if (!isPowerOfTwo) {
    /* DEV: we decide to fill the data with address(0) because no one
     ** own this address on Ethereum. This is very convenient for onchain
     ** purposes. Fill free to use whatever you want based on your needs
     */
    data = makeListLengthPowerOfTwo(data, ethers.constants.AddressZero);
  }

  // hash data to generate leaf nodes
  const leafsNodes = data.map(ethers.utils.keccak256);

  // generate the merkle tree
  const merkleTree = new MerkleTree(leafsNodes, ethers.utils.keccak256, {
    sortPairs: true,
  });

  if (process.env.PRINT_MERKLE) console.log(merkleTree.toString());

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
