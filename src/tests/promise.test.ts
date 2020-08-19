import { delay, retry } from "../promise";

describe("test delay function", () => {
  it("should wait 5000 milliseconds", async () => {
    const ms = 5000;
    const start = Date.now();
    await delay(ms);
    const end = Date.now();

    expect(start + ms <= end).toBeTruthy();
  });

  it("should wait 1000 milliseconds and retuned the value passed", async () => {
    const ms = 1000;
    const value = "promise";
    const start = Date.now();
    const returnedValue = await delay(1000, "promise");
    const end = Date.now();

    expect(returnedValue).toBe(value);
    expect(start + ms <= end).toBeTruthy();
  });
});

describe("test retry function", () => {
  it("should retry a function that aways throw an error", async () => {
    const retryFn = jest.fn(() => {
      throw new Error("Always Error");
    });
    await expect(() => retry(retryFn)).rejects.toThrow();

    expect(retryFn).toBeCalledTimes(3);
  });

  it("should retry a function 2 times then return a value", async () => {
    let retryConter = 0;
    const retryFn = jest.fn(() => {
      if (retryConter < 2) {
        retryConter++;
        throw new Error("Error");
      }
      return { data: "value" };
    });

    expect(await retry(retryFn, { logRetry: false })).toEqual({ data: "value" });
    expect(retryFn).toBeCalledTimes(3);
  });

  it("should should call onError and onRetryError functions", async () => {
    const retryFn = jest.fn(() => {
      throw new Error("Error");
    });

    const onError = jest.fn();
    const onRetryError = jest.fn(() => true);
    const retryTimes = 2;

    await expect(() =>
      retry(retryFn, { logRetry: false, retryTimes, onError, onRetryError })
    ).rejects.toEqual(new Error("Error"));

    expect(retryFn).toBeCalledTimes(retryTimes);
    expect(onError).toBeCalled();
    expect(onRetryError).toBeCalledTimes(retryTimes);
  });

  it("should throw the a error if onRetryError return false", async () => {
    const retryFn = jest.fn(() => {
      throw { status: 404 };
    });

    const onRetryError = jest.fn((err) => {
      if (err.status === 404) return false;
      return true;
    });

    await expect(() =>
      retry(retryFn, { logRetry: false, retryTimes: 2, onRetryError })
    ).rejects.toEqual({
      status: 404,
    });

    expect(retryFn).toBeCalledTimes(1);
    expect(onRetryError).toBeCalledTimes(1);
    expect(onRetryError).toReturnWith(false);
  });
});
