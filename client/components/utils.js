const { DateTime, Interval } = require('luxon');
const luxon = require('luxon');

const generateTimesInInterval = (interval, deltaDuration) => {
  let times = [];
  let cursor = interval.start;
  while (cursor < interval.end) {
    times.push(cursor);
    cursor = cursor.plus(deltaDuration);
  }
  return times;
};

const getDaysInIntervalFromStart = (interval) => {
  let days = [];
  let cursor = interval.start;
  while (cursor < interval.end) {
    days.push(cursor);
    cursor = cursor.plus({ days: 1 });
  }
  return days;
};

const getDaysInIntervalFromEnd = (interval) => {
  let days = [];
  let cursor = interval.end;
  while (cursor > interval.start) {
    days.push(cursor);
    cursor = cursor.minus({ days: 1 });
  }
  days.reverse();
  return days;
};

/*
 * start - start of first day in range
 * end - end of last day in range
 * deltaDuration - length of each time slot
 */
exports.generateDateTimeArray = (start, end, deltaDuration) => {
  const interval = Interval.fromDateTimes(start, end);
  const dayStarts = getDaysInIntervalFromStart(interval);
  const dayEnds = getDaysInIntervalFromEnd(interval);
  const times = [];
  for (let i = 0; i < dayEnds.length; i++) {
    const interval = Interval.fromDateTimes(dayStarts[i], dayEnds[i]);
    const arr = generateTimesInInterval(interval, deltaDuration);
    times.push(arr);
  }
  return times;
};

exports.getStringDatesFromArray = (timeslots) => {
  if (timeslots === null || timeslots === undefined || timeslots.length === 0) {
    return [];
  }
  const start = timeslots[0][0].time;
  const ndays = timeslots.length;
  const end = timeslots[ndays - 1][timeslots[ndays - 1].length - 1].time;
  const days = getDaysInIntervalFromStart(Interval.fromDateTimes(start, end));
  const date_format = 'EEE\nMMM d';
  return days.map((d) => d.toFormat(date_format));
};

// const logDateTimeArr = arr => console.log(arr.map(time => time.toHTTP()))
//
// const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
// const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
// const deltaDuration = luxon.Duration.fromObject({minutes: 60})
//
// const dateTimes = exports.generateDateTimeArray(start, end, deltaDuration)
// console.log("DATETIME ARRAY")
// dateTimes.forEach(col => {logDateTimeArr(col)})
