import { expect } from "chai";
import makeListLengthPowerOfTwo from "../utils/makeListLengthPowerOfTwo";
import randomInt from "../utils/randomNumber";

describe("makeListLengthPowerOfTwo", () => {
  it("valid power of two returns true", () => {
    for (let i = 0; i < 100; i++) {
      // generate a random number of elements between 2 and 10
      const randomPow = randomInt(2, 10);

      // calculate the two powers of 2 that will be the limits of the generated number
      const [topValidPowerOfTwo, bottomValidPowerOfTwo] = [
        2 ** randomPow,
        2 ** (randomPow - 1),
      ];

      // generate the random delta number that will be substract
      // from the topValidPowerOfTwo to make it uncompleted
      const randomDelta = randomInt(
        1,
        topValidPowerOfTwo - (bottomValidPowerOfTwo + 1)
      );

      // generate a list of (2^randomPow - randomDelta) elements
      const list = new Array(topValidPowerOfTwo - randomDelta).fill("");

      // generate a list that fullfill the expectation
      const generatedList = makeListLengthPowerOfTwo(list, "fake");

      // ensure the generated contains the correct number of elements
      expect(generatedList.length).to.eq(topValidPowerOfTwo);
      // ensure the correct number of fake element has been added to the list
      expect(generatedList.filter((elem) => elem === "fake").length).to.eq(
        randomDelta
      );
    }
  });
});
