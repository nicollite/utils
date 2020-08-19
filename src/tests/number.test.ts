import { randNumber } from "../number";

describe("test randNumber function", () => {
  it("should get a random number between 0 and 100", () => {
    const min = 0;
    const max = 100;
    const randomNumber = randNumber(min, max);
    expect(randomNumber).toBeLessThanOrEqual(100);
    expect(randomNumber).toBeGreaterThanOrEqual(0);
  });
});
