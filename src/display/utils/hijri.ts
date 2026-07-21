const HIJRI_EPOCH_YEAR = 1421;
const HIJRI_EPOCH_MONTH = 1;
const HIJRI_EPOCH_DAY = 1;

const HIJRI_EPOCH_GREGORIAN = new Date(
  Date.UTC(2000, 3, 6),
);

function gregorianToJulianDay(date: Date): number {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function hijriMonthLength(month: number): number {
  return month % 2 === 1 ? 30 : 29;
}

function isHijriLeapYear(year: number): boolean {
  const leapYearsInCycle = [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29];
  const yearInCycle = ((year - 1) % 30 + 30) % 30;
  return leapYearsInCycle.includes(yearInCycle === 0 ? 29 : yearInCycle);
}

function hijriYearLength(year: number): number {
  return isHijriLeapYear(year) ? 355 : 354;
}

function hijriDayOfYear(month: number, day: number): number {
  return (month - 1) * 30 - Math.floor((month - 1) / 2) + day;
}

const HIJRI_EPOCH_JD = gregorianToJulianDay(HIJRI_EPOCH_GREGORIAN);
const HIJRI_EPOCH_DOY = hijriDayOfYear(HIJRI_EPOCH_MONTH, HIJRI_EPOCH_DAY);

export function computeHijriDate(gregorianDate: Date): {
  day: number;
  month: number;
  year: number;
} {
  const jd = gregorianToJulianDay(gregorianDate);
  const daysSinceEpoch = jd - HIJRI_EPOCH_JD + HIJRI_EPOCH_DOY - 1;

  const totalDays = Math.floor(daysSinceEpoch);
  const y30Cycles = Math.floor(totalDays / (30 * 354 + 11));
  let remainingDays = totalDays - y30Cycles * (30 * 354 + 11);

  let year = HIJRI_EPOCH_YEAR + y30Cycles * 30;
  let yearLen: number;

  while (remainingDays >= (yearLen = hijriYearLength(year))) {
    remainingDays -= yearLen;
    year++;
  }

  let month = 1;
  let monthLen: number;
  while (remainingDays >= (monthLen = hijriMonthLength(month))) {
    remainingDays -= monthLen;
    month++;
  }

  const day = remainingDays + 1;

  return { day, month, year };
}

export { hijriDayOfYear };
