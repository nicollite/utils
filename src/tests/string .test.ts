import { reduceText, autoId } from "../string";

describe("test reduceText function", () => {
  const string = "This is a very long text";

  it("should reduce the amount of characters in a text with a reduce length", () => {
    const reduceLen = 10;
    const reduceStr = reduceText(string, reduceLen);
    expect(reduceStr.endsWith("...")).toBeTruthy();
    expect(reduceStr.length === reduceLen + 3).toBeTruthy();
  });

  it("should not reduce a text wotn a high reduce length", () => {
    const reduceLen = 100;
    const reduceStr = reduceText(string, reduceLen);
    expect(reduceStr.endsWith("...")).toBeFalsy();
    expect(reduceStr.length === string.length).toBeTruthy();
  });
});

describe("test autoId function", () => {
  it("should generate a id with 20 characteres and this characteres be on a certain range of char codes", () => {
    const id = autoId();
    expect(id.length).toBe(20);
    const testCharCodes = id
      .split("")
      .every(
        (char) =>
          (char.charCodeAt(0) >= 65 && char.charCodeAt(0) <= 122) ||
          (char.charCodeAt(0) >= 48 && char.charCodeAt(0) <= 57)
      );
    expect(testCharCodes).toBeTruthy();
  });

  it("should generate a string with a 100 characteres", () => {
    expect(autoId(100).length).toBe(100);
  });

  it("should generate a string with a 20 characteres given a invalid length", () => {
    expect(autoId(-1).length).toBe(20);
  });
});
