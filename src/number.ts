/**
 * Get a random int number beetween `min` and `max`
 * @param min The min number (included)
 * @param max The max number (not included)
 * @returns A random number
 */
export function randNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
