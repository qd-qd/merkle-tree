import { expect } from "chai";
import { ethers } from "hardhat";
import generateMerkle from "../scripts/generateMerkle";
import { CORRECT_ADDRESS, INCORRECT_ADDRESS } from "../data/constants.json";

type Factory = Awaited<ReturnType<typeof ethers.getContractFactory>>;

describe("MerkleAirdrop", function () {
  let contract: Awaited<ReturnType<Factory["deploy"]>>;
  let generateProof: (address: string) => Array<string>;
  let rootHash: string;
  let proofLength: number;

  // generate the merkle tree, and generate proofs for the correct address.
  before(() => {
    const {
      rootHash: _rootHash,
      generateProof: _generateProof,
      proofLength: _proofLength,
    } = generateMerkle();
    generateProof = _generateProof;
    rootHash = _rootHash;
    proofLength = _proofLength;
  });

  beforeEach(async () => {
    const Factory = await ethers.getContractFactory("MerkleAirdrop");
    contract = await Factory.deploy(`0x${rootHash}`, proofLength);
    await contract.deployed();
  });

  it("ensure the control address generate the correct proofs and pass the smart-contract check", async () => {
    const proofs = generateProof(CORRECT_ADDRESS);
    await expect(contract.isIncluded(CORRECT_ADDRESS, proofs)).to.emit(
      contract,
      "True"
    );
  });

  it("ensure the incorrect addresses can't pass the verification even by using correct someone else proofs", async () => {
    const correctProofsStolen = generateProof(CORRECT_ADDRESS);

    await expect(
      contract.isIncluded(INCORRECT_ADDRESS, correctProofsStolen)
    ).to.emit(contract, "False");

    await expect(
      contract.isIncluded(ethers.constants.AddressZero, correctProofsStolen)
    ).to.emit(contract, "False");
  });

  it("ensure incorrect addresses do not generate proofs", () => {
    const correctProofsStolen = generateProof(INCORRECT_ADDRESS);
    expect(correctProofsStolen.length).to.eq(0);
  });

  it("ensure the smart-contract method revert is the number of proofs passed isn't correct", async () => {
    const [_, ...proofs] = generateProof(CORRECT_ADDRESS);

    await expect(contract.isIncluded(CORRECT_ADDRESS, proofs)).to.reverted;
  });
});
