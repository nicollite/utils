import { TypeOf } from "./utils";

// Other functions

/**
 * Receives a value and check if it is of the type
 * @param value The value to check the type
 * @param type The type to test
 * @returns A boolean checking if the value is of the received type
 */
export function is(value: any, type: "boolean"): value is boolean;
export function is(value: any, type: "function"): value is Function;
export function is(value: any, type: "number"): value is number;
export function is(value: any, type: "string"): value is string;
export function is(value: any, type: "undefined"): value is undefined;
export function is(value: any, type: "bigint"): value is bigint;
export function is(value: any, type: "symbol"): value is symbol;
export function is(value: any, type: "object"): value is object;
export function is(value: any, type: "null"): value is null;
export function is(value: any, type: "array"): value is any[];
export function is(value: any, type: "date"): value is Date;
export function is(value: any, type: TypeOf): value is any;
export function is(value: any, type: TypeOf): boolean {
  //Logic for null, array and data
  if (type === "array") return Array.isArray(value);
  if (type === "null") return value === null;
  if (type === "date") return value instanceof Date;

  // If type is object check if it's not null, an array or date
  if (type === "object" && (value === null || Array.isArray(value) || value instanceof Date))
    return false;

  //Set all types
  const types: TypeOf[] = [
    "boolean",
    "function",
    "number",
    "string",
    "undefined",
    "bigint",
    "symbol",
    "object",
  ];

  //Remove the selected type from the array
  const typeIndex: number = types.findIndex((t) => t === type);
  types.splice(typeIndex, 1);

  //Check if the value is not from any other type
  return types.every((t: TypeOf) => t !== typeof value);
}
