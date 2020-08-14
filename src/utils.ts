/** Exporte function that could be utilfor certains operations */

// General Functions
export * from "./array";
export * from "./date";
export * from "./object";
export * from "./others";
export * from "./promise";
export * from "./string";
export * from "./number";

/** Every javascript primitive type and aditional instance types */
export type TypeOf =
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "undefined"
  | "bigint"
  | "symbol"
  | "object"
  | "null"
  | "array"
  | "date";

/** Operation types for checkArrays */
export type CheckArrayOperation = "difference" | "intercept";

/**  Options for checkArrays function */
export interface CheckArraysOptions {
  path?: string | string[];
  path2?: string | string[];
  operation?: CheckArrayOperation;
}

/** Options for retry function */
export interface RetryOptions {
  /** Number of retrys, default is 5 */
  retryTimes?: number;
  /** Indicates if retry logs will be logged */
  logRetry?: boolean;
  /**
   * On error function that is called when retry times end, default throw the error
   * @param err The error throwed in the last retry
   */
  onError?: <T = any>(err: T) => any;
  /**
   * Function that execute before retring, must return a boolean that indicates if the retry must continue
   * @param err The error throwed in retry
   */
  onRetryError?: <T = any>(err: T) => boolean | Promise<boolean>;
}
