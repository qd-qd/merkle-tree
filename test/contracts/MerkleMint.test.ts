import * as dotenv from "dotenv";
import { expect } from "chai";
import { ethers } from "hardhat";
import generateMerkle from "../../scripts/generateMerkle";
import { generateRandomAddresses } from "../../utils/generateRandomAddresses";
import { doesNotReject } from "assert";

type Factory = Awaited<ReturnType<typeof ethers.getContractFactory>>;

dotenv.config();

describe("MerkleMint", function () {
  let contract: Awaited<ReturnType<Factory["deploy"]>>;
  let generateProof: (address: string) => Array<string>;
  let whitelist: Array<string>;
  let numberOfAddresses: number;

  // Read the environnement file to know how many addresses should be generated in the whitelist
  // The function ensure the tree would be balanced by checking if `Math.log2(num) % 1 === 0`
  before(async function () {
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
    const Factory = await ethers.getContractFactory("MerkleMint");
    contract = await Factory.deploy(`0x${rootHash}`, proofLength);
    await contract.deployed();

    // save current important variables that would be used by the tests
    generateProof = _generateProof;
    whitelist = _whitelist;
  });

  it("ensure all the valid addresses can mint by passing the proofs", async () => {
    let id = 0;
    for await (let address of whitelist) {
      const proofs = generateProof(address);

      await expect(contract.premint(address, id, proofs))
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, address, id);

      id++;
    }
  });

  it("ensure the _mint function works as expected", async () => {
    const randomAddresses = generateRandomAddresses(32);
    let id = 0;

    for await (let address of randomAddresses) {
      const proofs = generateProof(address);

      await expect(contract.mint(address, id, proofs))
        .to.emit(contract, "Transfer")
        .withArgs(ethers.constants.AddressZero, address, id);

      id++;
    }
  });

  it("ensure it is not possible to mind if someone pass valid proofs of someone else", async () => {
    const [validAddress] = whitelist;
    const correctProofsStolen = generateProof(validAddress);
    let incorrectAddress: string;

    // generate new address until it is not included in the whitelist
    do {
      incorrectAddress = ethers.Wallet.createRandom().address;
    } while (whitelist.includes(incorrectAddress));

    // ensure this specific case revert
    await expect(
      contract.premint(incorrectAddress, 0, correctProofsStolen)
    ).to.revertedWith("NotIncluded");
  });

  it("ensure it's not possible to mint if the number of proofs passed is incorrect", async () => {
    const [validAddress] = whitelist;
    const [_, ...proofs] = generateProof(validAddress);

    // if we pass less proofs than the required number, the tx revert
    await expect(contract.premint(validAddress, 0, proofs)).to.revertedWith(
      "IncorrectNumberOfProof"
    );

    // if we pass more proofs than the required number, the tx revert
    await expect(
      contract.premint(validAddress, 0, [...proofs, proofs[0], proofs[0]])
    ).to.revertedWith("IncorrectNumberOfProof");
  });
});
