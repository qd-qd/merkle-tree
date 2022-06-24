import { expect } from "chai";
import { ethers } from "hardhat";
import {
  generateRandomAddresses,
  DEFAULT_NUMBER_OF_ELEMENT,
} from "../utils/generateRandomAddresses";

describe("generateRandomAddresses", () => {
  it("generated list has the correct number of generated elements", () => {
    for (let i = 0; i < 10; i++) {
      // generate a random number of elements between 1 and 13
      const randomIntumber = Math.floor(Math.random() * (13 - 1 + 1) + 1);
      const generatedList = generateRandomAddresses(randomIntumber);
      expect(generatedList.length).to.eq(randomIntumber);
    }
  });

  it("generated addresses are valid", () => {
    const generatedList = generateRandomAddresses(25);
    generatedList.forEach(
      (address) => expect(ethers.utils.isAddress(address)).to.true
    );
  });

  it("generated addresses are valid", () => {
    const generatedList = generateRandomAddresses(25);
    expect(generatedList).to.not.include(ethers.constants.AddressZero);
  });

  it(`generated list contains ${DEFAULT_NUMBER_OF_ELEMENT} when called w/o arguments`, () => {
    const generatedList = generateRandomAddresses();
    expect(generatedList.length).to.eq(DEFAULT_NUMBER_OF_ELEMENT);
  });
});
