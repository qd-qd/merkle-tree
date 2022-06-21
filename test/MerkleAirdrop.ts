import { expect } from "chai";
import { ethers } from "hardhat";
import generateMerkle from "../scripts/generateMerkle";
import { CORRECT_ADDRESS, INCORRECT_ADDRESS } from "../data/constants.json";

type Factory = Awaited<ReturnType<typeof ethers.getContractFactory>>;

describe("MerkleAirdrop", function () {
  let contract: Awaited<ReturnType<Factory["deploy"]>>;
  let proofs: Array<string>;
  let rootHash: string;

  before(() => {
    const { rootHash: _rootHash, generateProof } = generateMerkle();
    proofs = generateProof(CORRECT_ADDRESS);
    rootHash = _rootHash;
  });

  beforeEach(async () => {
    const Factory = await ethers.getContractFactory("MerkleAirdrop");
    contract = await Factory.deploy(`0x${rootHash}`);
    await contract.deployed();
  });

  it("ensure the control address is included", async () => {
    await expect(contract.isIncluded(CORRECT_ADDRESS, proofs)).to.emit(
      contract,
      "True"
    );
  });

  it("ensure the incorrect addresses aren't included", async () => {
    await expect(contract.isIncluded(INCORRECT_ADDRESS, proofs)).to.emit(
      contract,
      "False"
    );

    await expect(
      contract.isIncluded(ethers.constants.AddressZero, proofs)
    ).to.emit(contract, "False");
  });
});
