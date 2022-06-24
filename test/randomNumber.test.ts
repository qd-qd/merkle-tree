import { expect } from "chai";
import randomNumber from "../utils/randomNumber";

describe("randomNumer", () => {
  it("generate only int number", () => {
    expect(randomNumber(1, 100_000) % 1).to.eq(0);
  });

  it("generate number inside the passed range", () => {
    const [min, max] = [1, 100_000];
    const number = randomNumber(min, max);

    expect(number).to.lte(max);
    expect(number).to.gte(min);
  });
});
