// Function for promise

/** Options for retry function */
export interface RetryOptions {
  /** Number of retrys, default is 5 */
  retryTimes?: number;
  /** Indicates if retry logs will be logged */
  logRetry?: boolean;
  /**
   * On error function that is called when retry times end, default throw the error.
   * @param err The error throwed in the last retry
   */
  onError?: <T = any>(err: T) => void | Promise<void>;
  /**
   * Function that execute before retring, must return a boolean that indicates if true
   * the retry must continue, if false the error is throwed.
   * @param err The error throwed in retry
   */
  onRetryError?: <T = any>(err: T) => boolean | Promise<boolean>;
}

/**
 * Returns `Promise` delayed in given ms
 * @param ms
 */
export async function delay(ms: number, value?: any): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms, value));
}

/**
 * Retry to execute a function on error with exponencial back off
 * @param retryFn Retry function to execute
 * @param options Number of times to retry
 */
// export async function retry<T = any>(
//   retryFn: () => Promise<T>,
// ): Promise<T>;
// export async function retry<T = any>(
//   retryFn: () => Promise<T> | T,
//   options: RetryOptions;
// ): Promise<T>;
export async function retry<T = any>(
  retryFn: () => Promise<T> | T,
  options: RetryOptions = {},
): Promise<T> {
  const defautlOnError = (err: any) => {
    console.log("Limit of retry achieved");
  };

  const defautlOnRetryError = (err: any) => true;

  const {
    retryTimes = 3,
    logRetry = true,
    onError = defautlOnError,
    onRetryError = defautlOnRetryError,
  } = options;

  /** Count of retry attempts */
  let retryAttempts: number = 0;

  /** Closure function for retring  */
  const closureFn = async (remainingAttempts: number, err?: any): Promise<T> => {
    if (remainingAttempts === 0) {
      await onError(err);
      throw err;
    }

    // Exponencial backoff for retrys
    await delay(1000 * 2 ** retryAttempts);

    if (logRetry && remainingAttempts < retryTimes) console.log("Retring to execute function");
    try {
      return retryFn();
    } catch (err) {
      // Add 1 to attempt retry
      retryAttempts++;
      if (logRetry) {
        console.error("Error on retring");
        console.error(err);
        console.log("Attempts to retry");
      }
      if (await onRetryError(err)) return closureFn(remainingAttempts - 1, err);
      else throw err;
    }
  };

  return closureFn(retryTimes);
}
