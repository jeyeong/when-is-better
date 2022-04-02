const { Interval, DateTime, Duration } = require('luxon');

// specify days
const start = DateTime.fromISO('2022-04-03T08:00:00');
const end = DateTime.fromISO('2022-04-10T21:00:00');

// specify times
const interval = Interval.fromDateTimes(start, end);

const half_hour = Duration.fromISOTime('00:30:00');
const time_intervals = interval.splitBy(half_hour);

// const day_intervals = interval.splitBy();

const stringTimes = time_intervals.map((interval) => [
  interval.start.toFormat('dd HH:mm'),
  interval.end.toFormat('dd HH:mm'),
]);

console.log('stringTimes: ', stringTimes);
