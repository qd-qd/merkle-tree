import { expect } from "chai";
import isNPowerOfTwo from "../utils/isNPowerOfTwo";
import randomInt from "../utils/randomNumber";

describe("isNPowerOfTwo", () => {
  it("valid power of two returns true", () => {
    for (let i = 0; i < 10; i++) {
      // generate a random number of elements between 1 and 80
      const randomNumber = randomInt(1, 80);
      expect(isNPowerOfTwo(2 ** randomNumber)).to.true;
    }
  });

  it("0 returns false", () => {
    expect(isNPowerOfTwo(0)).to.false;
  });

  it("incorrect number returns false", () => {
    for (let i = 0; i < 10; i++) {
      // generate an incorrect random number of elements between 257 and 511
      const randomIncorrectNumber = randomInt(257, 511);
      expect(isNPowerOfTwo(randomIncorrectNumber)).to.false;
    }
  });
});
