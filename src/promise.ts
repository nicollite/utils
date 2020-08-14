import { RetryOptions } from "./utils";

// Function for promise

/**
 * Returns `Promise` delayed in given ms
 * @param ms
 */
export async function delay(ms: number, value?: any): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms, value));
}

/**
 * Retry to execute a function on error with exponencial back off
 * @param retryTimes Number of times to retry
 * @param retryFn Retry function to execute
 */
export async function retry<T = any>(
  retryFn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const defautlOnError = (err: any) => {
    console.log("Limit of retry achieved");
    throw err;
  };

  const defautlOnRetryError = (err: any) => true;

  const {
    retryTimes = 5,
    logRetry = true,
    onError = defautlOnError,
    onRetryError = defautlOnRetryError
  } = options;

  /** Count of retry attempts */
  let retryAttempts: number = 0;

  /** Closure function for retring  */
  const closureFn = async (num: number, err?: any): Promise<T> => {
    if (num === 0) {
      onError(err);
      return;
    }

    // Exponencial backoff for retrys
    await delay(2 ** retryAttempts * 1000);

    if (logRetry) console.log("Retring to execute function");
    return retryFn().catch(err => {
      // Add 1 to attempt retry
      retryAttempts++;
      if (logRetry) {
        console.error("Error on retring");
        console.error(err);
        console.log("Attempts to retry");
      }
      if (defautlOnRetryError) return closureFn(num - 1, err);
    });
  };

  return closureFn(retryTimes);
}
