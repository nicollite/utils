import { is } from "./others";

// Function for object manipulation

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
 * @param key If data isn't an object data with be setted in this key on `obj`
 *
 * @returns A new object with the data values inserted
 */
export function setDataInObject(data: any, obj: any = {}, key?: string): any {
  if (!is(data, "object")) {
    if (!key) throw new Error("key argument must be provided to set a data that is not a object");
    obj[key] = data;
    return obj;
  }

  Object.entries(data).forEach(([key, value]) => {
    // Check if value is a object
    if (is(value, "object")) {
      // if obj in position key isn't a object set it as an object
      if (!is(obj[key], "object")) obj[key] = {};

      obj[key] = setDataInObject(value, obj[key], key);
    } else {
      obj[key] = value;
    }
  });

  return obj;
}

/**
 * Log the received avoid the reference
 * @param obj Object that will be logged
 * @param msg Message that appears before the object
 */
export function logObj(obj?: any): void {
  console.log(getObjectRef(obj));
}

/**
 * Receives an object and return another object with one deep where the nested paths
 * are in the key represented with a dot notations and the value is the path value
 * @param obj Any object
 * @example
 * const obj = {
 *  a: 1,
 *  b: {
 *    c: [1,2,3]
 *    d: {
 *      e: "str"
 *    }
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
 * //   "b.d.e": "str"
 * // }
 *
 * @returns A flat object with the paths on the keys with a dot separated string
 */
export function getObjectPaths(obj: object): object {
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
  for (let field in obj) {
    // Sum the field name and the value inside
    sum += is(obj, "array") ? 0 : field.length + 1;
    sum +=
      obj[field] instanceof Date
        ? 8
        : is(obj[field], "array") || is(obj[field], "object")
        ? caculateFirstoreFieldSize(obj[field])
        : is(obj[field], "boolean")
        ? 1
        : is(obj[field], "number")
        ? 8
        : is(obj[field], "null")
        ? 1
        : is(obj[field], "string")
        ? obj[field].length + 1
        : 0;
  }
  return sum;
}

/**
 * Receives a value and return the constructor name
 * @param obj
 */
export const instanceName = (obj: any): string => obj.constructor.name;

export function isObjectOrArray(obj: any): boolean {
  return is(obj, "object") && is(obj, "array");
}

/**
 * Create a reference for the given with object coping the data inside it
 * and removing
 * @param obj A object that can have nested objects and arrays
 * @returns A copy of the given object
 */
export function getObjectRef<T = any>(obj: T): T {
  // If obj is not an array or object return the value
  if (!is(obj, "object") && !is(obj, "array")) return obj;
  // If it's an array return a recurcive map of the values inside
  if (is(obj, "array")) {
    return (obj as any).concat().map((item) => getObjectRef(item)) as any;
  }
  // If obj is a object create a reference and iterate on each property
  const ref = Object.assign({}, obj);
  Object.entries(ref).forEach(([key, value]) => {
    if (!is(value, "object") && !is(value, "array")) return;
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
  if (is(v1, "date") && !is(v2, "date")) return false;
  else if (is(v2, "date")) return v1.valueOf() === v2.valueOf();

  // Compare objects recursively
  for (const key of Object.keys(v1)) if (!isEqual(v1[key], v2[key])) return false;

  return true;
}
