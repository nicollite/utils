import {
  arraysDifference,
  arraysIntersection,
  choice,
  flatArray,
  flattenDeep,
  removeRepeat,
  sliceArray,
  sortArray,
} from "../array";

describe("test arraysDifference function", () => {
  it("should get an array with the difference between two non object arrays", () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [3, 4, 5, 6];
    expect(arraysDifference(arr1, arr2)).toEqual([5, 6]);
    expect(arraysDifference(arr2, arr1)).toEqual([1, 2]);
  });

  it("should get an array with the difference between two object arrays with a the same refenrence path", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ x: 3 }, { x: 4 }, { x: 5 }];
    expect(arraysDifference(arr1, arr2, { path: "x" })).toEqual([{ x: 4 }, { x: 5 }]);
  });

  it("should get an array with the difference between two deep nested object arrays with a the same refenrence path", () => {
    const arr1 = [{ x: { y: { z: 1 } } }, { x: { y: { z: 2 } } }, { x: { y: { z: 3 } } }];
    const arr2 = [{ x: { y: { z: 3 } } }, { x: { y: { z: 4 } } }, { x: { y: { z: 5 } } }];
    expect(arraysDifference(arr1, arr2, { path: "x.y.z" })).toEqual([
      { x: { y: { z: 4 } } },
      { x: { y: { z: 5 } } },
    ]);
  });

  it("should get an array with the difference between two object arrays with a the diferent refenrence paths", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ y: 3 }, { y: 4 }, { y: 5 }];
    expect(arraysDifference(arr1, arr2, { path: "x", path2: "y" })).toEqual([{ y: 4 }, { y: 5 }]);
  });
});

describe("test arraysIntersection function", () => {
  it("should get an array with the intersection between two non object arrays", () => {
    const arr1 = [1, 2, 3, 4];
    const arr2 = [3, 4, 5, 6];
    expect(arraysIntersection(arr1, arr2)).toEqual([3, 4]);
  });

  it("should get an array with the intersection between two object arrays with a the same refenrence path", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ x: 3 }, { x: 4 }, { x: 5 }];
    expect(arraysIntersection(arr1, arr2, { path: "x" })).toEqual([{ x: 3 }]);
  });

  it("should get an array with the intersection between two deep nested object arrays with a the same refenrence path", () => {
    const arr1 = [{ x: { y: { z: 1 } } }, { x: { y: { z: 2 } } }, { x: { y: { z: 3 } } }];
    const arr2 = [{ x: { y: { z: 3 } } }, { x: { y: { z: 4 } } }, { x: { y: { z: 5 } } }];
    expect(arraysIntersection(arr1, arr2, { path: "x.y.z" })).toEqual([{ x: { y: { z: 3 } } }]);
  });

  it("should get an array with the intersection between two object arrays with a the diferent refenrence paths", () => {
    const arr1 = [{ x: 1 }, { x: 2 }, { x: 3 }];
    const arr2 = [{ y: 3 }, { y: 4 }, { y: 5 }];
    expect(arraysIntersection(arr1, arr2, { path: "x", path2: "y" })).toEqual([{ y: 3 }]);
  });
});

describe("test choice function", () => {
  test("should get a random item from the array", () => {
    const array = [1, { x: 42 }, "test string", true];
    const item = choice(array);
    expect(array.find((i) => i === item)).not.toBeUndefined();
  });
});

describe("test flatArray function", () => {
  it("should flat a two dimension array in one level deep", () => {
    const array = [
      [1, 2],
      [3, 4],
      [5, 6],
    ];
    expect(flatArray(array)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should flat the inside arrays in one level", () => {
    const array = [[1, 2], 3, 4, [5, 6]];
    expect(flatArray(array)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it("should flat the array in just one level", () => {
    const array = [1, 2, [3, 4], [[5, 6]]];
    expect(flatArray(array)).toEqual([1, 2, 3, 4, [5, 6]]);
  });
});

describe("test flattenDeep function", () => {
  it("should flat all array levels", () => {
    expect(flattenDeep([1, [2], [[3]], [[4, [5]], 6], [[[7]]]])).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
});

describe("test removeRepeat function", () => {
  it("should remove repeated values in non object array", () => {
    const array = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
    expect(removeRepeat(array)).toEqual([1, 2, 3, 4]);
  });

  it("should remove repeated custom objects with values in a given path", () => {
    class TestObject {
      constructor(public id: string, public name: string) {}
    }

    const array = [
      new TestObject("1", "name 1"),
      new TestObject("1", "name 2"),
      new TestObject("2", "name 3"),
      new TestObject("3", "name 4"),
      new TestObject("3", "name 4"),
    ];
    const path = "id";
    expect(removeRepeat(array, path)).toEqual([
      new TestObject("1", "name 1"),
      new TestObject("2", "name 3"),
      new TestObject("3", "name 4"),
    ]);
  });

  it("should remove deep nest objects", () => {
    const array = [
      { x: { y: { z: 1 } } },
      { x: { y: { z: 1 } } },
      { x: { y: { z: 2 } } },
      { x: { y: { z: 2 } } },
      { x: { y: { z: 3 } } },
    ];
    const path = "x.y.z";
    expect(removeRepeat(array, path)).toEqual([
      { x: { y: { z: 1 } } },
      { x: { y: { z: 2 } } },
      { x: { y: { z: 3 } } },
    ]);
  });
});

describe("test sliceArray function", () => {
  it("should create a array with slices with the same length", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sliceLen = 2;
    expect(sliceArray(array, sliceLen)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
    ]);
  });

  it("should creete a array with slices where the last slice has a different length", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const sliceLen = 3;
    expect(sliceArray(array, sliceLen)).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
  });
});

describe("test sortArray function", () => {
  it("should sort a array with non object values", () => {
    const array = [8, 3, 55, 1, 34, 13, 1, 2, 21, 5];
    expect(sortArray(array)).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55]);
  });

  it("should sort a array with non object values in reverse", () => {
    const array = [8, 3, 55, 1, 34, 13, 1, 2, 21, 5];
    expect(sortArray(array, "", true)).toEqual([55, 34, 21, 13, 8, 5, 3, 2, 1, 1]);
  });

  it("should an object array", () => {
    const array = [
      { x: { y: { z: 1 } } },
      { x: { y: { z: 5 } } },
      { x: { y: { z: 2 } } },
      { x: { y: { z: 1 } } },
      { x: { y: { z: 3 } } },
    ];
    const path = "x.y.z";
    expect(sortArray(array, path)).toEqual([
      { x: { y: { z: 1 } } },
      { x: { y: { z: 1 } } },
      { x: { y: { z: 2 } } },
      { x: { y: { z: 3 } } },
      { x: { y: { z: 5 } } },
    ]);
  });
});
