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
  if (timeslots === null || timeslots === undefined) {
    return [];
  }
  const start = timeslots[0][0].time;
  const ndays = timeslots.length;
  const end = timeslots[ndays - 1][timeslots[ndays - 1].length - 1].time;
  const days = getDaysInIntervalFromStart(Interval.fromDateTimes(start, end));
  const date_format = 'EEE\nMMM d';
  return days.map((d) => d.toFormat(date_format));
};

/*
  groupDaySlots
    a helper Function that groups slots into groups so that 
    they sum to an hour
*/
exports.groupDaySlots = (day, deltaTime) => {
  const groupSize = 60 / deltaTime;
  const clonedDay = JSON.parse(
    JSON.stringify(day)
  ); /* clone so we don't modify day which is an array inside timeslots that is passed in by reference*/
  let arrays = [];
  while (clonedDay.length > 0) {
    arrays.push(clonedDay.splice(0, groupSize));
  }
  return arrays;
};

/*
  formatSlotTime
    Here is the issue: we have a day which is an array of intervals, eg. [[8-815],[815-830],...]
    Now, we want to group up these intervals into groups so that each group is an hour. 
    This will make styling the front end easier. 
    But you can't modify the day array itself as it is is an array within the timeSelection array. 
    Hence, you must make a deep copy. 
    But when you make a copy, the items inside day no longer have access to the same 
    methods; they becomes strings --> Need (date) string to format function. 
*/
exports.formatSlotTime = (slotTime) => {
  const a = DateTime.fromISO(slotTime);
  return a.toFormat('h:mm a');
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
