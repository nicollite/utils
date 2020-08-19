import {
  caculateFirstoreFieldSize,
  getObjectPaths,
  getObjectRef,
  instanceName,
  isEqual,
  iterateThrowObj,
  setDataInObject,
} from "../object";

describe("test caculateFirstoreFieldSize function", () => {
  it("should calculate the size", () => {
    const obj = {
      // 4 letter + 1 + 1 true
      bool: true,
      // 3 letters + 1 + 8 number
      num: 42,
      // 4 letters + 1 + 1 null
      null: null,
      // 3 letters + 1 + 6 string letters + 1
      str: "string",
      // 9 letters + 1
      nestedObj: {
        // 1 letters + 1
        a: {
          // 1 letters + 1 + 8 date
          b: new Date(),
        },
      },
      // 3 letter + 1
      arr: [
        // 1 letter + 1 + 8 number
        { x: 1 },
        // 1 letter + 1 + 8 number
        { x: 2 },
      ],
    };

    const expectSum = 81;

    expect(caculateFirstoreFieldSize(obj)).toBe(expectSum);
  });
});

describe("test getObjectPaths function", () => {
  it("should create the a flat object with all paths represented in the keys", () => {
    const obj = {
      a: 1,
      b: {
        c: [1, 2, 3],
        d: {
          e: "str",
        },
        f: null,
      },
      g: [
        { x: 1, y: 2, z: 3 },
        { x: 3, y: 1, z: 2 },
        { x: 2, y: 3, z: 1 },
      ],
    };

    const objPaths = getObjectPaths(obj);
    expect(objPaths).toEqual({
      a: 1,
      "b.c.0": 1,
      "b.c.1": 2,
      "b.c.2": 3,
      "b.d.e": "str",
      "b.f": null,
      "g.0.x": 1,
      "g.0.y": 2,
      "g.0.z": 3,
      "g.1.x": 3,
      "g.1.y": 1,
      "g.1.z": 2,
      "g.2.x": 2,
      "g.2.y": 3,
      "g.2.z": 1,
    });
  });
});

describe("test getObjectRef function", () => {
  it("should create a new object that has no reference to the original object", () => {
    const obj = {
      a: 1,
      b: "",
      c: {
        d: null,
        e: {},
        f: new Date(),
      },
      g: [{ x: 1 }, { x: 2 }, { x: 3 }],
    };
    const objRef = getObjectRef(obj);

    // Check the object references with "==="
    expect(objRef === obj).toBeFalsy();
    expect(objRef.c === obj.c).toBeFalsy();
    expect(objRef.c.e === obj.c.e).toBeFalsy();
    expect(objRef.c.f === obj.c.f).toBeFalsy();

    expect(objRef.g[0] === obj.g[0]).toBeFalsy();
    expect(objRef.g[1] === obj.g[1]).toBeFalsy();
    expect(objRef.g[2] === obj.g[2]).toBeFalsy();
  });
});

describe("test instanceName function", () => {
  it("should get the instance name of a object", () => {
    expect(instanceName([])).toBe("Array");
    expect(instanceName({})).toBe("Object");

    expect(instanceName(1)).toBe("Number");
    expect(instanceName("")).toBe("String");
    expect(instanceName(true)).toBe("Boolean");
  });

  it("should get the instance name of custom classes", () => {
    class TestObj1 {}
    class TestObj2 {}
    class TestObj3 extends TestObj2 {}

    expect(instanceName(new TestObj1())).toBe("TestObj1");
    expect(instanceName(new TestObj2())).toBe("TestObj2");
    expect(instanceName(new TestObj3())).toBe("TestObj3");
  });
});

describe("test isEqual function", () => {
  it("should check if the values and nested values in a object are equal", () => {
    const obj1 = {
      a: "",
      b: 1,
      c: {
        d: {
          e: null,
          f: new Date(),
        },
        g: ["1", "2", "3"],
      },
      h: [{ x: { y: { z: 1 } } }, { x: { y: { z: 2 } } }, { x: { y: { z: 3 } } }],
    };

    const obj2 = {
      a: "",
      b: 1,
      c: {
        d: {
          e: null,
          f: new Date(),
        },
        g: ["1", "2", "3"],
      },
      h: [{ x: { y: { z: 1 } } }, { x: { y: { z: 2 } } }, { x: { y: { z: 3 } } }],
    };

    expect(isEqual(obj1, obj2)).toBeTruthy();
  });

  it("should compare values comming from class object", () => {
    class TestObject {
      constructor(public a, public b, public c) {}
    }

    class ExtendTestObject extends TestObject {
      constructor(a, b, c, public d?: any) {
        super(a, b, c);
      }
    }

    const obj1 = new TestObject(1, { x: 1 }, [1, 2, 3]);
    const obj2 = { a: 1, b: { x: 1 }, c: [1, 2, 3] };
    const obj3 = new ExtendTestObject(1, { x: 1 }, [1, 2, 3]);

    expect(isEqual(obj1, obj2)).toBeTruthy();
    expect(isEqual(obj1, obj3)).toBeFalsy();
    expect(isEqual(obj2, obj3)).toBeFalsy();
  });

  it("should compare different objects as false", () => {
    const obj1 = { a: "1" };
    const obj2 = { a: 1 };

    expect(isEqual(obj1, obj2)).toBeFalsy();

    const obj3 = { b: (arg3) => arg3 };
    const obj4 = { b: (arg4) => arg4 };
    expect(isEqual(obj3, obj4)).toBeTruthy();

    const obj5 = { date: new Date() };
    const obj6 = { date: Date.now() };
    expect(isEqual(obj5, obj6)).toBeFalsy();

    const obj7 = { a: [1, 2, 3] };
    const obj8 = { b: [1, 2] };
    expect(isEqual(obj7, obj8)).toBeFalsy();
  });
});

describe("test iterateThrowObj function", () => {
  it("should get nested itens in a object", () => {
    const obj = {
      a: "string",
      b: 1,
      c: {
        d: {
          e: null,
        },
        f: ["1", "2", "3"],
      },
      g: { x: { y: { z: "xyz string" } } },
    };

    expect(iterateThrowObj(obj, "a")).toBe("string");
    expect(iterateThrowObj(obj, "b")).toBe(1);
    expect(iterateThrowObj(obj, "c.d")).toEqual({ e: null });
    expect(iterateThrowObj(obj, "c.f.0")).toBe("1");
    expect(iterateThrowObj(obj, "g.x.y.z")).toBe("xyz string");
  });

  it("should iterate into non object values", () => {
    expect(iterateThrowObj(1)).toBe(1);
    expect(iterateThrowObj(null)).toBe(null);
    expect(iterateThrowObj("str")).toBe("str");
  });

  it("should iterate into non existing paths", () => {
    const obj = { a: 1 };
    expect(iterateThrowObj(obj, "a.b.c")).toBeUndefined();
  });
});

describe("test setDataInObject function", () => {
  it("should set the data in the object", () => {
    const obj = {
      a: 1,
      b: "str",
      c: true,
    };
    const data = { b: "new str" };
    expect(setDataInObject(data, obj)).toEqual({
      a: 1,
      b: "new str",
      c: true,
    });
  });

  it("should change nested paths with the data", () => {
    const obj = {
      a: "str",
      b: 1,
      c: { d: { e: null } },
    };
    const data = {
      a: "new str",
      b: { f: { g: {} } },
      c: { d: { e: 42 } },
    };

    expect(setDataInObject(data, obj)).toEqual({
      a: "new str",
      b: { f: { g: {} } },
      c: { d: { e: 42 } },
    });
  });
});
