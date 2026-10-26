export type CalendarMonthRange = {
  readonly start: Date;
  readonly end: Date;
};

const CALENDAR_MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;
const EARLIEST_CALENDAR_YEAR = 2000;
const LATEST_CALENDAR_YEAR = 2100;

export function getCalendarMonthRange(value: string): CalendarMonthRange | undefined {
  const match = CALENDAR_MONTH_PATTERN.exec(value);
  if (!match) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  if (year < EARLIEST_CALENDAR_YEAR || year > LATEST_CALENDAR_YEAR) {
    return undefined;
  }

  const firstDay = new Date(Date.UTC(year, month, 1));
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const start = new Date(Date.UTC(year, month, 1 - firstDay.getUTCDay()));
  const end = new Date(Date.UTC(year, month + 1, 6 - lastDay.getUTCDay(), 23, 59, 59, 999));

  return { start, end };
}
