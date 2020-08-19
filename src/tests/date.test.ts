import { addDay, leapYear } from "../date";

describe("test addDay function", () => {
  it("should add a full day to a Date", () => {
    const date = new Date(2020, 11, 31, 12, 0, 0, 0);
    expect(addDay(date).valueOf()).toBe(new Date(2021, 0, 1, 12, 0, 0, 0).valueOf());
  });
});

describe("test leapYear function", () => {
  it("should test a leap year", () => {
    expect(leapYear(2020)).toBeTruthy();
    expect(leapYear(2021)).toBeFalsy();
  });
});
