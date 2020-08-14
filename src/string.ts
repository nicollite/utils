// Functions for string manipulation or

/**
 * Text reducer based on number of chars
 * @param text
 * @param numberOfChar
 *
 * @returns Reduced string with ... in the end
 */
export function reduceText(text: string, numberOfChar: number): string {
  if (text.length > numberOfChar) return `${text.substr(0, numberOfChar)}...`;
  return text;
}

/**
 * Auto generate an id
 * @param length The length of the id string
 */
export function autoId(length: number = 20): string {
  // Validate length
  length = length <= 0 ? 20 : length;

  // Alphanumeric characters
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let autoId = "";
  for (let i = 0; i < length; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return autoId;
}
