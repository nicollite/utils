import { iterateThrowObj } from "./object";

// Functions for array manipulation

/** The options for 2 array operations, where the arrays are arrays of objects */
export interface ArraysOptions {
  /** The path for both arrays, or the path for the first array if the 2nd path is passed */
  path?: string | string[];
  /** The path the 2nd path is passed */
  path2?: string | string[];
}

/**
 * Get the different itens in the arr2 that isn't in arr1
 * @param arr1 First array
 * @param arr2 Second array
 * @param options For arrays of objects use the paths to indicate the fields that will be comparade.
 * The paths could be given as a string array or a string in dot representation of the path.
 * For arrays with the same objects structure use `path` and for arrays with diferent structures use `path2`.
 *
 * @example
 * // Get itens in a non objects array
 * const arr1 = [1,2,3,4,5]
 * const arr2 = [4,5,6,7,8]
 *
 * arraysDifference(arr1,arr2)
 * // [6,7,8]
 *
 * @example
 * // Get itens in arrays with the same kind of objects
 * const arr1 = [{ x:1 },{ x:2 },{ x:3 }]
 * const arr2 = [{ x:3 },{ x:4 },{ x:5 }]
 *
 * arraysDifference(arr1,arr2, { path: "x" })
 * // [{ x:4 }, { x:5 }]
 *
 * @example
 * // Get itens in arrays with the same kind of objects
 * const arr1 = [{ x:1 },{ x:2 },{ x:3 }]
 * const arr2 = [{ y: { x:3 } },{ y: { x:4 } },{ y: { x:5 } }]
 *
 * arraysDifference(arr1,arr2, { path: "x", path2: "y.x" })
 * // [{ y: { x:4 } },{ y: { x:5 } }]
 *
 * @returns The itens in arr2 that is not in arr1
 */
export function arraysDifference<T = any, S = T>(
  arr1: T[],
  arr2: S[],
  options: ArraysOptions = {},
): T[] | S[] {
  const { path, path2 } = options;

  // Includes function filter the arrays with includes
  const includeDiff = (array1, array2) => array2.filter((v2) => !array1.includes(v2));
  // One path function uses "path" to iterate in the object in both arrays
  const onePathDiff = (array1, array2) =>
    array2.filter((obj2) =>
      array1.every((obj1) => iterateThrowObj(obj1, path) !== iterateThrowObj(obj2, path)),
    );
  // One path function uses "path" for array1 and path2 for array2 to iterate in the object in both arrays
  const twoPathDiff = (array1, array2) =>
    array2.filter((obj2) =>
      array1.every((obj1) => iterateThrowObj(obj1, path) !== iterateThrowObj(obj2, path2)),
    );

  // Use the appropriaded diff function
  if (!path && !path2) return includeDiff(arr1, arr2);
  else if (path && !path2) return onePathDiff(arr1, arr2);
  return twoPathDiff(arr1, arr2);
}

/**
 * Get itens in the arr2 that that appears in arr1
 * @param arr1 First array
 * @param arr2 Second array
 * @param options For arrays of objects use the paths to indicate the fields that will be comparade.
 * The paths could be given as a string array or a string in dot representation of the path.
 * For arrays with the same objects structure use `path` and for arrays with diferent structures use `path2`.
 *
 * @example
 * // Get itens in a non objects array
 * const arr1 = [1,2,3,4,5]
 * const arr2 = [4,5,6,7,8]
 *
 * arraysIntersection(arr1,arr2)
 * // [4,5]
 *
 * @example
 * // Get itens in arrays with the same kind of objects
 * const arr1 = [{ x:1 },{ x:2 },{ x:3 }]
 * const arr2 = [{ x:3 },{ x:4 },{ x:5 }]
 *
 * arraysIntersection(arr1,arr2, { path: "x" })
 * // [{ x:3 }]
 *
 * @example
 * // Get itens in arrays with the same kind of objects
 * const arr1 = [{ x:1 },{ x:2 },{ x:3 }]
 * const arr2 = [{ y: { x:3 } },{ y: { x:4 } },{ y: { x:5 } }]
 *
 * arraysIntersection(arr1,arr2, { path: "x", path2: "y.x" })
 * // [{ y: { x:3 } }]
 *
 * @returns The itens in arr2 that is not in arr1
 */
export function arraysIntersection<T = any, S = T>(
  arr1: T[],
  arr2: S[],
  options: ArraysOptions = {},
): T[] | S[] {
  const { path, path2 } = options;

  // Includes function filter the arrays with includes
  const includeIntersect = (array1, array2) => array2.filter((v2) => array1.includes(v2));
  // One path function uses "path" to iterate in the object in both arrays
  const onePathIntersect = (array1, array2) =>
    array2.filter((obj2) =>
      array1.some((obj1) => iterateThrowObj(obj1, path) === iterateThrowObj(obj2, path)),
    );
  // One path function uses "path" for array1 and path2 for array2 to iterate in the object in both arrays
  const twoPathIntersect = (array1, array2) =>
    array2.filter((obj2) =>
      array1.some((obj1) => iterateThrowObj(obj1, path) === iterateThrowObj(obj2, path2)),
    );

  // Use the appropriaded diff function
  if (!path && !path2) return includeIntersect(arr1, arr2);
  else if (path && !path2) return onePathIntersect(arr1, arr2);
  return twoPathIntersect(arr1, arr2);
}

/**
 * Remove every repeated item in the array, the array must be sorted to do this operation
 * @param arr The array that will be checked
 * @param path a optional path for array with objects
 *
 * @returns The array with no repeated item
 */
// Todo add sort opetation
export function removeRepeat<T = any>(arr: T[], path: string | string[] = ""): T[] {
  // Get a new array and it's length
  const newArr = arr.concat();
  const len = newArr.length;
  for (let i = len; i > 0; i--) {
    // Filter the array with the value
    const value = iterateThrowObj(newArr[i], path);
    const filterdArr = newArr.filter((item) => iterateThrowObj(item, path) === value);
    // If the filter return more than 1 position remove the current
    if (filterdArr.length > 1) newArr.splice(i, 1);
  }
  return newArr;
}

/**
 * Get array and slice return a array of arrays
 * @param arr The array to be sliced
 * @param sliceLen The slice length
 */
export function sliceArray<T = any>(arr: T[], sliceLen: number): T[][] {
  const slicedArray: T[][] = [];
  const arrLen = arr.length;
  for (let start = 0; start < arrLen; start += sliceLen)
    slicedArray.push(arr.slice(start, start + sliceLen));
  return slicedArray;
}

/**
 * Flat one level deep of and array of arrays
 * @param arr The array that will be flatted
 */
export function flatArray<T = any>(arr: T[][]): T[];
export function flatArray<T = any>(arr: (T | T[])[]): T[];
export function flatArray(arr: any[]): any[];
export function flatArray<T = any>(arr: (T | T[])[]): T[] {
  return arr.reduce((acc: any[], val) => acc.concat(val), []);
}

/**
 * Flat all levels deep of an array of arrays
 * @param arr The array that will be flatted
 */
export function flattenDeep<T = any>(arr: any[]): T[] {
  return arr.reduce(
    (acc, val) => (Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val)),
    [],
  );
}

/**
 * Sort an array, if it's an array of objects the path can be used for the sort property
 * @param arr The array to be sorted
 * @param path A optional path if the array is an object
 * @param reverse If true the array will be in decrescent order
 *
 * @returns The sorted array
 */
export function sortArray<T = any>(arr: T[], path: string | string[] = "", reverse = false): T[] {
  if (reverse)
    return arr.sort((a, b) =>
      iterateThrowObj(a, path) > iterateThrowObj(b, path)
        ? -1
        : iterateThrowObj(a, path) < iterateThrowObj(b, path)
        ? 1
        : 0,
    );

  return arr.sort((a, b) =>
    iterateThrowObj(a, path) < iterateThrowObj(b, path)
      ? -1
      : iterateThrowObj(a, path) > iterateThrowObj(b, path)
      ? 1
      : 0,
  );
}

/**
 * Gets a random position on the array
 * @param arr Array to get random position
 */
export function choice<T = any>(arr: T[]): T {
  const position = Math.floor(Math.random() * arr.length);
  return arr[position];
}
