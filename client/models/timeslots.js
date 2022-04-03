const { DateTime, Interval } = require('luxon')
const luxon = require('luxon')

const generateTimesInInterval = (interval, delta_duration) => {
  let times = []
  let cursor = DateTime.fromHTTP(interval.start.toHTTP())
  while (cursor < interval.end) {
    times.push(cursor)
    cursor = cursor.plus(delta_duration)
  }
  return times
}

const getDaysInIntervalFromStart = (interval) => {
  let days = []
  let cursor = DateTime.fromHTTP(interval.start.toHTTP())
  while (cursor < interval.end) {
    days.push(cursor)
    cursor = cursor.plus({ days: 1 })
  }
  return days
}

const getDaysInIntervalFromEnd = (interval) => {
  let days = []
  let cursor = DateTime.fromHTTP(interval.end.toHTTP())
  while (cursor > interval.start) {
    days.push(cursor)
    cursor = cursor.minus({ days: 1 })
  }
  days.reverse()
  return days
}

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
  const interval = Interval.fromDateTimes(start, end)
  const dayStarts = getDaysInIntervalFromStart(interval)
  const dayEnds = getDaysInIntervalFromEnd(interval)
  let times = []
  for (let i = 0; i < dayEnds.length; i++) {
    const interval = Interval.fromDateTimes(dayStarts[i], dayEnds[i])
    const day_times = generateTimesInInterval(interval, delta_duration)
    const timeslots = day_times.map((time) => {
      return { editLock: false, people_available: [], selected: false, time }
    })
    times.push(timeslots)
  }
  return times
}

const timeSlotSelect = (timeslots, dayIndex, timeIndex) => {
  if (!timeslots[i][j].editLock) {
    let new_timeslots = structuredClone(timeslots)
    new_timeslots[i][j]
  }
}

/*
 * available_times is a 2d array
 */
const getFirstAndLastTime = (available_times) => {
  let first_time = available_times[0][0]
  let end_time = available_times[0][available_times[0].length - 1]
  for (day of available_times) {
    let day_start = day[0]
    let day_end = day[day.length - 1]
  }
}

const getEventObject = async (event_id) => {
  const resp = await fetch(`${process.env.BACKEND_URL}/event/${event_id}`, {
    method: 'GET',
    mode: 'cors',
  })
  if (resp.code != 'SUCCESS') {
    return null
  }
  let event = {
    event_id: resp.event.event_id,
    creator: resp.event.creator,
    event_name: resp.event.event_name,
    description: resp.event.description,
    time_interval_min: resp.event.time_interval_min,
  }
}

export { generateTimeSlotArray, timeSlotSelect, getEventObject }

// const logDateTimeArr = arr => console.log(arr.map(time => time.toHTTP()))

// const start = DateTime.fromObject({year: 2022, month: 4, day: 3, hour: 8})
// const end = DateTime.fromObject({year: 2022, month: 4, day: 7, hour: 21})
// const delta_duration = luxon.Duration.fromObject({minutes: 60})

// const dateTimes = exports.generateTimeSlotArray(start, end, delta_duration)

// console.log("DATETIME ARRAY")
// console.log(dateTimes)
// dateTimes.forEach(day => day.forEach(timeslot => {console.log(timeslot)}))
