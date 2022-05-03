import { useState } from 'react';
import Hammer from 'react-hammerjs';
import utils from '../../components/utils';
const { DateTime, Interval } = require('luxon');

import styles from '../../styles/Create.module.css';

const TIMES = [
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
  '6pm',
  '7pm',
  '8pm',
];

const HARDCODED_DATES = ['Apr 4 Mon', 'Apr 5 Tue', 'Apr 6 Wed', 'Apr 7 Thu'];

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const TimeSelection = ({ timeslots, setTimeslots, deltaTime }) => {
  // TODO: refactor y offset
  const findTimeIndex = (coords) => {
    return Math.floor((coords.y - 123) / 40);
  };

  /* Records whether the first actions has been taken, and if so, whether it
     was an selection or a deselection. This ensures that we do not deselect
     slots when the first action was a selection, an undesirable user
     behavior. */
  const [firstAction, setFirstAction] = useState({
    taken: false,
    isSelection: false,
  });

  /* When a slot is "painted over," it should be selected/deselected based on
     the following criteria:
     (1) Consistent with the first action: If the first selection was a
         selection, subsequent actions must be selections (i.e., do not
         deselect selected slots when hovered over). Same if the first
         selection was a deselection. This is achieved using firstAction.
     (2) One-change-per-session: A slot must only be changed once per
         "tap-and-drag" session. This is achieved using editLocks. */
  const onPaint = (e, dayIndex) => {
    const timeIndex = findTimeIndex(e.center);

    // Get slot of interest
    const slotToModify = timeslots[dayIndex][timeIndex];

    // Set first action attributes
    if (!firstAction.taken) {
      setFirstAction({
        taken: true,
        isSelection: !slotToModify.selected,
      });
    }

    // First check: edit lock
    if (!slotToModify.editLock) {
      // Second check: first action
      if (
        // (1) First action was selection but now we want to deselect OR
        // (2) First action was deselection but now we want to select
        !(
          (firstAction.isSelection && slotToModify.selected) ||
          (!firstAction.isSelection && !slotToModify.selected)
        ) ||
        // (3) Edge case: bug where component does not re-render in time
        (!firstAction.taken && !firstAction.isSelection)
      ) {
        // Toggle timeslot
        setTimeslots(
          timeslots.map((day, i) =>
            i === dayIndex
              ? day.map((slot, j) =>
                  j === timeIndex
                    ? {
                        editLock: true,
                        people_available: slot.people_available,
                        selected: !slot.selected,
                        time: slot.time,
                      }
                    : slot
                )
              : day
          )
        );
      }
    }
  };

  const resetLocks = () => {
    setTimeslots(
      timeslots.map((day) => day.map((slot) => ({ ...slot, editLock: false })))
    );
    setFirstAction({ taken: false, isSelection: false });
  };

  const dates = utils.getStringDatesFromArray(timeslots);
  return (
    <>
      <div className={styles.day__headers}>
        {dates.map((date, i) => (
          <h4 key={i}>{date}</h4>
        ))}
      </div>
      <div
        className={styles.selection__container}
        onTouchEnd={resetLocks}
        onMouseUp={resetLocks}
      >
        {timeslots.map((day, i) => (
          <Hammer
            onPan={(e) => onPaint(e, i)}
            onTap={(e) => onPaint(e, i)}
            direction="DIRECTION_ALL"
            key={i}
          >
            <div className={styles.datebox__container}>
              {groupDaySlots(day, deltaTime).map((slotGroup, i) => (
                <div key={i} className={styles.slot_group}>
                  {slotGroup.map((slot, i) => (
                    <div
                      className={
                        slot.selected
                          ? styles.datebox__selected
                          : styles.datebox
                      }
                      key={i}
                    >
                      {/* {slot.time.toFormat('h:mm a')} */}
                      {formatSlotTime(slot.time)}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            {/* <div className={styles.datebox__container}>
              {day.map((slot, i) => (
                <div
                  className={
                    slot.selected ? styles.datebox__selected : styles.datebox
                  }
                  key={i}
                >
                  {slot.time.toFormat('h:mm a')}
                </div>
              ))}
            </div> */}
          </Hammer>
        ))}
      </div>
    </>
  );
};

export default TimeSelection;

const groupDaySlots = (day, deltaTime) => {
  /* group the slot into groups of n. I.e slots of 15 min get grouped 
     into 4. */
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
Here is the issue: we have a day which is an array of intervals, eg. [[8-815],[815-830],...]
Now, we want to group up these intervals into groups so that each group is an hour. 
This will make styling the front end easier. 
But you can't modify the day array itself as it is is an array within the timeSelection array. 
Hence, you must make a deep copy. 
But when you make a copy, the items inside day no longer have access to the same 
methods; they becomes strings --> Need (date) string to format function. 
*/
const formatSlotTime = (slotTime) => {
  const a = DateTime.fromISO(slotTime);
  return a.toFormat('h:mm a');
};

/*

*/
