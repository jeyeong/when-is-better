const { DateTime, Interval, Duration } = require('luxon');
const luxon = require('luxon');
const BACKEND_URL='https://when-is-better-backend.herokuapp.com'

const generateTimesInInterval = (interval, delta_duration) => {
  let times = [];
  let cursor = DateTime.fromHTTP(interval.start.toHTTP());
  while (cursor < interval.end) {
    times.push(cursor);
    cursor = cursor.plus(delta_duration);
  }
  return times;
};

const getDaysInIntervalFromStart = (interval) => {
  let days = [];
  let cursor = DateTime.fromHTTP(interval.start.toHTTP());
  while (cursor < interval.end) {
    days.push(cursor);
    cursor = cursor.plus({ days: 1 });
  }
  return days;
};

const getDaysInIntervalFromEnd = (interval) => {
  let days = [];
  let cursor = DateTime.fromHTTP(interval.end.toHTTP());
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
 * delta_duration - length of each time slot
 *
 * timeslots are of type
 * {
 *   time - datetime
 *   people_available - array
 *   selected - bool
 *   editLock - bool
 * }
 */
const generateTimeSlotArray = (start, end, delta_duration) => {
  const interval = Interval.fromDateTimes(start, end);
  const dayStarts = getDaysInIntervalFromStart(interval);
  const dayEnds = getDaysInIntervalFromEnd(interval);
  let times = [];
  for (let i = 0; i < dayEnds.length; i++) {
    const interval = Interval.fromDateTimes(dayStarts[i], dayEnds[i]);
    const day_times = generateTimesInInterval(interval, delta_duration);
    const timeslots = day_times.map((time) => {
      return { editLock: false, people_available: [], selected: false, available: false, time };
    });
    times.push(timeslots);
  }
  return times;
};

const timeSlotSelect = (timeslots, dayIndex, timeIndex) => {
  if (!timeslots[i][j].editLock) {
    let new_timeslots = structuredClone(timeslots);
    new_timeslots[i][j];
  }
};


const getEventObject = (event_id) => {
  fetch(`${BACKEND_URL}/event/${event_id}`, {
    method: 'GET',
    mode: 'cors',
  }).then(resp => resp.json())
    .then(resp => {
    if (resp.code != 'SUCCESS') {
      return null;
    }
    let event = {
      event_id: resp.event.event_id,
      creator: resp.event.creator,
      event_name: resp.event.event_name,
      description: resp.event.description,
    };
    const delta_duration = Duration.fromObject({minutes: resp.event.time_interval_min})
    let timeslots = generateTimeSlotArray(DateTime.fromHTTP(resp.event.time_start), 
                                          DateTime.fromHTTP(resp.event.time_end), delta_duration)
    
    resp.event.available_times.forEach((day, i) => day.forEach(available_time_str => {
      // const available_time = DateTime.fromHTTP(available_time_str)
      let day_timeslots = timeslots[i]
      day_timeslots.forEach(timeslot => {
        // TODO: fix
        if (timeslot.time.toHTTP() == available_time_str) {
          timeslot.available = true
        }
      })
    }))
  
    event.timeslots = timeslots;
    return event
  });
  
};

export { generateTimeSlotArray, timeSlotSelect, getEventObject };

// console.log(getEventObject('532040'))
// const logDateTimeArr = arr => console.log(arr.map(time => time.toHTTP()))

// const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
// const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
// const delta_duration = luxon.Duration.fromObject({minutes: 60})

// const dateTimes = exports.generateTimeSlotArray(start, end, delta_duration)

// console.log("DATETIME ARRAY")
// console.log(dateTimes)
// dateTimes.forEach(day => day.forEach(timeslot => {console.log(timeslot)}))
