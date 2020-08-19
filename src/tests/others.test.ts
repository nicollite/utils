import { is } from "../others";

describe("test is function", () => {
  it("should test non object types", () => {
    // Truthy tests
    expect(is(BigInt(1), "bigint")).toBeTruthy();
    expect(is(false, "boolean")).toBeTruthy();
    expect(is(() => {}, "function")).toBeTruthy();
    expect(is(null, "null")).toBeTruthy();
    expect(is(42, "number")).toBeTruthy();
    expect(is("str", "string")).toBeTruthy();
    expect(is(Symbol(), "symbol")).toBeTruthy();
    expect(is(undefined, "undefined")).toBeTruthy();

    // Falsy tests
    expect(is(undefined, "bigint")).toBeFalsy();
    expect(is(BigInt(1), "boolean")).toBeFalsy();
    expect(is(false, "function")).toBeFalsy();
    expect(is(() => {}, "null")).toBeFalsy();
    expect(is(null, "number")).toBeFalsy();
    expect(is(42, "string")).toBeFalsy();
    expect(is("str", "symbol")).toBeFalsy();
    expect(is(Symbol(), "undefined")).toBeFalsy();
  });

  it("should test object types", () => {
    // Truthy tests
    expect(is({}, "object")).toBeTruthy();
    expect(is([], "array")).toBeTruthy();
    expect(is(new Date(), "date")).toBeTruthy();
    class TestObject {}
    expect(is(new TestObject(), "object")).toBeTruthy();
    expect(is(new TestObject(), "objectLike")).toBeTruthy();

    // Falsy tests
    expect(is(1, "object")).toBeFalsy();
    expect(is(null, "objectLike")).toBeFalsy();
    expect(is("str", "objectLike")).toBeFalsy();
  });
});
