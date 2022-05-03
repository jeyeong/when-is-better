const { DateTime, Interval, Duration } = require('luxon');
const luxon = require('luxon');
const BACKEND_URL = 'https://when-is-better-backend.herokuapp.com';

const generateTimesInInterval = (interval, deltaDuration) => {
  let times = [];
  let cursor = DateTime.fromHTTP(interval.start.toHTTP());
  while (cursor < interval.end) {
    times.push(cursor);
    cursor = cursor.plus(deltaDuration);
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
 * deltaDuration - length of each time slot
 *
 * timeslots are of type
 * {
 *   time - datetime
 *   people_available - array
 *   selected - bool
 *   editLock - bool
 * }
 */
const generateTimeSlotArray = (start, end, deltaDuration) => {
  const interval = Interval.fromDateTimes(start, end);
  const dayStarts = getDaysInIntervalFromStart(interval);
  const dayEnds = getDaysInIntervalFromEnd(interval);
  let times = [];
  for (let i = 0; i < dayEnds.length; i++) {
    const interval = Interval.fromDateTimes(dayStarts[i], dayEnds[i]);
    const day_times = generateTimesInInterval(interval, deltaDuration);
    const timeslots = day_times.map((time) => {
      return {
        editLock: false,
        people_available: [],
        selected: false,
        available: false,
        time,
      };
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
  const rv = fetch(`${BACKEND_URL}/event/${event_id}`, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.code != 'SUCCESS') {
        return null;
      }
      let event = {
        event_id: resp.event.event_id,
        creator: resp.event.creator,
        event_name: resp.event.event_name,
        description: resp.event.description,
      };
      const deltaDuration = Duration.fromObject({
        minutes: resp.event.time_interval_min,
      });
      let timeslots = generateTimeSlotArray(
        DateTime.fromHTTP(resp.event.time_start),
        DateTime.fromHTTP(resp.event.time_end),
        deltaDuration
      );

      resp.event.available_times.forEach((day, i) =>
        day.forEach((available_time_str) => {
          // const available_time = DateTime.fromHTTP(available_time_str)
          let day_timeslots = timeslots[i];
          day_timeslots.forEach((timeslot) => {
            // TODO: fix
            if (timeslot.time.toHTTP() == available_time_str) {
              timeslot.available = true;
            }
          });
        })
      );

      // keep track of available people at each timeslot
      let people_available_times = {};
      resp.responses.forEach((resp) => {
        const name = resp.name;
        resp.selected_times.forEach((time) => {
          if (time in people_available_times) {
            people_available_times[time].push(name);
          } else {
            // create new entry
            people_available_times[time] = [name];
          }
        });
      });

      timeslots.forEach((day_timeslots) => {
        day_timeslots.forEach((timeslot) => {
          // TODO: fix
          const time_str = timeslot.time.toHTTP();

          if (!(time_str in people_available_times)) {
            timeslot.people_available = [];
          } else {
            timeslot.people_available = people_available_times[time_str];
          }
        });
      });

      event.timeslots = timeslots;
      return event;
    });

  return rv;
};

export { generateTimeSlotArray, timeSlotSelect, getEventObject };

// const logDateTimeArr = arr => console.log(arr.map(time => time.toHTTP()))

// const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
// const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
// const deltaDuration = luxon.Duration.fromObject({minutes: 60})

// const dateTimes = exports.generateTimeSlotArray(start, end, deltaDuration)

// console.log("DATETIME ARRAY")
// console.log(dateTimes)
// dateTimes.forEach(day => day.forEach(timeslot => {console.log(timeslot)}))
