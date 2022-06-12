import { DateTime, Duration } from 'luxon';

const defaultStart = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 4,
  hour: 8,
}).setZone('America/Chicago');

const defaultEnd = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 7,
  hour: 20,
}).setZone('America/Chicago');

const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;

export { defaultStart, defaultEnd, MINUTES_15, MINUTES_30, MINUTES_60 };
