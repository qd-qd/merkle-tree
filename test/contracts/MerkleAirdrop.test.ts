import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import generateMerkle from "../../scripts/generateMerkle";
import { generateRandomAddresses } from "../../utils/generateRandomAddresses";

type Factory = Awaited<ReturnType<typeof ethers.getContractFactory>>;

dotenv.config();

describe("MerkleAirdrop", function () {
  let contract: Awaited<ReturnType<Factory["deploy"]>>;
  let generateProof: (address: string) => Array<string>;
  let whitelist: Array<string>;
  let numberOfAddresses: number;

  // Read the environnement file to know how many addresses should be generated in the whitelist
  // The function ensure the tree would be balanced by checking if `Math.log2(num) % 1 === 0`
  before(function () {
    const numberOfElement = process.env.NUMBER_OF_ADRESSES_TO_GENERATE;

    try {
      // if it is undefined
      if (numberOfElement === undefined) throw new Error();
      const num = parseInt(numberOfElement);
      // if it isn't a valid number
      if (isNaN(num)) throw new Error();

      numberOfAddresses = num;
    } catch {
      numberOfAddresses = 32;
    }
  });

  beforeEach(async function () {
    // generate a fake whitelist
    const _whitelist = generateRandomAddresses(numberOfAddresses);
    // generate the associated Merkle Tree
    const {
      rootHash,
      generateProof: _generateProof,
      proofLength,
    } = generateMerkle(_whitelist);

    // deploy the contracts with the current root hash and number of proofs required
    const Factory = await ethers.getContractFactory("MerkleAirdrop");
    contract = await Factory.deploy(`0x${rootHash}`, proofLength);
    await contract.deployed();

    // save current important variables that would be used by the tests
    generateProof = _generateProof;
    whitelist = _whitelist;
  });

  it("ensure all the valid addresses generate valid proofs and pass the smart-contract check", async () => {
    for (let address of whitelist) {
      const proofs = generateProof(address);

      await expect(contract.isIncluded(address, proofs)).to.emit(
        contract,
        "True"
      );
    }
  });

  it("ensure that an incorrect address can't pass the verification even by using valid proofs from someone else", async () => {
    const [validAddress] = whitelist;
    const correctProofsStolen = generateProof(validAddress);
    await expect(
      contract.isIncluded(ethers.constants.AddressZero, correctProofsStolen)
    ).to.emit(contract, "False");
  });

  it("ensure the smart-contract method revert is the number of proofs passed isn't correct", async () => {
    const [validAddress] = whitelist;
    const [_, ...proofs] = generateProof(validAddress);
    await expect(contract.isIncluded(validAddress, proofs)).to.revertedWith(
      "IncorrectNumberOfProof"
    );
  });
});
