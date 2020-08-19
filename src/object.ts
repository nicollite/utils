import { is } from "./others";

// Function for object manipulation

interface ObjectLike {
  [key: string]: any;
}

/**
 * Iterate throw an object and return the value within the given path
 * @param obj the object that will be iterate
 * @param paths the path for iteration, if a empty string or array is provided
 * just return the value
 */
export function iterateThrowObj<T = any, S = any>(obj: T, paths?: string | string[]): S {
  if (!paths || (!Array.isArray(paths) && typeof paths !== "string") || paths.length === 0)
    return (obj as any) as S;
  // Set a reference to the object
  const assingObj = Object.assign({}, obj);
  // If path is string convert it into an array
  const objPaths = typeof paths === "string" ? paths.split(".") : paths.concat();
  // Get the value inside path
  const value = assingObj[objPaths.shift()];
  if (!value) return value;
  // If the objects path is not empty and the value is a object return a recursive iterateThrowObj
  if (objPaths.length !== 0) return iterateThrowObj(value, objPaths);
  // Else just return the value
  return value;
}

/**
 * Receives the data and the object and insert the data values in the object
 * @param data The data to be setted
 * @param obj The object to set the data
 * @param options
 *
 * @returns A new object with the data values inserted
 */
export function setDataInObject(data: ObjectLike, obj: ObjectLike): ObjectLike {
  // Get a reference of the object
  const newObj = getObjectRef(obj);
  // Get the all paths in data obj to set the data in each
  const dataObjPaths = getObjectPaths(data);

  // For all paths
  Object.entries(dataObjPaths).forEach(([dotPaths, value]) => {
    // Get a array with the paths and pop the last path
    const paths = dotPaths.split(".");
    const lastPath = paths.pop();

    // Set a iterator to go throw all the paths in the object
    let pathIterator = newObj;
    paths.forEach((pathKey) => {
      // If the path is not a object like set a object
      if (!is(pathIterator[pathKey], "objectLike")) pathIterator[pathKey] = {};
      // Go to the next path
      pathIterator = pathIterator[pathKey];
    });

    // Set the value in the last path
    pathIterator[lastPath] = value;
  });

  return newObj;
}

/**
 * Receives an object and return another object with one deep where the nested paths
 * are in the key represented with a dot notations and the value is the path value
 * @param obj Any object
 * @example
 * const obj = {
 *  a: 1,
 *  b: {
 *    c: [1,2,3],
 *    d: {
 *      e: "str"
 *    }
 *    f: null
 *  }
 * }
 *
 * const newObj = getObjectPaths(obj)
 * console.log(newObj)
 * // {
 * //   a: 1,
 * //   "b.c.0": 1,
 * //   "b.c.1": 2,
 * //   "b.c.2": 3,
 * //   "b.d.e": "str",
 * //   "b.f": null
 * // }
 *
 * @returns A flat object with the paths on the keys with a dot separated string
 */
export function getObjectPaths(obj: ObjectLike): ObjectLike {
  // Set the new flat object
  let newObj = {};

  // Iterate throw the keys and values of the object
  Object.entries(obj).forEach(([key, value]) => {
    // Check if the value is a object or an array,
    // if it is check the values length in the object/array is greater than 0
    if ((is(value, "object") || is(value, "array")) && Object.values(value).length > 0)
      // For the object/array recursively get the object paths then set it in the
      // newObj writing the dot notation path with the path value
      Object.entries(getObjectPaths(value)).forEach(([keyObj, valueObj]) => {
        newObj[`${key}.${keyObj}`] = valueObj;
      });
    // If the value is not a object or array just set it in the key path
    else newObj[key] = value;
  });

  // Return the flat object
  return newObj;
}

/**
 * Calculate the size of a object in for a firestore document
 * @param obj Any object
 *
 * @returns An array with key value of each value in the object
 */
export function caculateFirstoreFieldSize(obj: any): number {
  let sum: number = 0;
  // for (let field in obj) {
  Object.entries(obj).forEach(([key, value]) => {
    // Sum the field name and the value inside
    sum += is(value, "array") ? 0 : key.length + 1;
    sum +=
      value instanceof Date
        ? 8
        : is(value, "array") || is(value, "object")
        ? caculateFirstoreFieldSize(value)
        : is(value, "boolean")
        ? 1
        : is(value, "number")
        ? 8
        : is(value, "null")
        ? 1
        : (value as string).length + 1;
  });
  return sum;
}

/**
 * Receives a value and return the constructor name
 * @param obj
 */
export const instanceName = (obj: any): string => obj.constructor.name;

/**
 * Create a reference for the given with object coping the data inside it
 * and removing
 * @param obj A object that can have nested objects and arrays
 * @returns A copy of the given object
 */
export function getObjectRef<T = any>(obj: T): T {
  // If obj isn't a object like return the value
  if (!is(obj, "objectLike")) return obj;

  // If it's an array return a recurcive map of the values inside
  if (is(obj, "array")) return (obj as any).concat().map((item) => getObjectRef(item)) as any;

  // If it's a date return a new date
  if (is(obj, "date")) return new Date(obj.valueOf()) as any;

  // If obj is a object create a reference and iterate on each property
  const ref = Object.assign({}, obj);
  Object.entries(ref).forEach(([key, value]) => {
    ref[key] = getObjectRef(value);
  });
  return ref;
}

/**
 * Recursively check if the given values are equal, this function can compare objects deeply nested
 *  The following restrictions are applied:
 * - For `Date` object the valueOf() method is used to compare the Unix Timestamp.
 * - For `Function` just check if both values has the typeof "functions".
 * - `Object` and `Array` values are checked recursively in each key.
 * - Other types are check with "==="
 *
 * @param v1 The first value to compare
 * @param v2 The second value to compare
 *
 * @returns A boolean that indicates if the valeus is the same
 */
export function isEqual(v1: any, v2: any): boolean {
  // Check if the v1 and v2 are not objects like
  if (!is(v1, "objectLike") && !is(v2, "objectLike")) {
    // Compare if the typeof are the same, then compare if the values are the same
    if (typeof v1 !== typeof v2) return false;
    // For function types return true
    else if (typeof v1 === "function" && typeof v2 === "function") return true;
    else return v1 === v2;
  }

  // Compare dates
  if (is(v1, "date") && is(v2, "date")) return v1.valueOf() === v2.valueOf();
  else if ((is(v1, "date") && !is(v2, "date")) || (!is(v1, "date") && is(v2, "date"))) return false;

  // Get the keys of each object
  const obj1Key = Object.keys(v1);
  const obj2Key = Object.keys(v2);

  if (obj1Key.length !== obj2Key.length) return false;

  // Check if every key in each object exists in the other
  const obj1KeysInObj2 = obj1Key.every((key1) => obj2Key.some((key2) => key2 === key1));
  const obj2KeysInObj1 = obj2Key.every((key1) => obj2Key.some((key2) => key2 === key1));
  if (!obj1KeysInObj2 || !obj2KeysInObj1) return false;

  // If the keys are equals compare the objects recursively
  for (const key of Object.keys(v1)) {
    if (!isEqual(v1[key], v2[key])) return false;
  }

  return true;
}
