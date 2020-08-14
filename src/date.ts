// Functions for date manipulation

/** Number of milliseconds in a day */
export const millisecondInDay = 24 * 60 * 60 * 1000;

/**
 * Add a day to a day object
 * @param date The Date obejct
 * @param daysToAdd The amount of days to add to the date. Default is 1
 * @returns A new date object with the amount days
 */
export function addDay(date: Date, daysToAdd: number = 1): Date {
  return new Date(date.valueOf() + daysToAdd * millisecondInDay);
}

/**
 * Check if a year is leap
 * @param year The year to be checked
 * @returns A boolean that indicates if the year is a leap year
 */
export function leapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/** Number of days in an month, where january is the index 0 and december is 11  */
export const monthsRef = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
