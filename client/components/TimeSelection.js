import { useEffect, useState } from 'react';
import Hammer from 'react-hammerjs';
import utils from '../components/utils';
const { DateTime } = require('luxon');

import styles from '../styles/Create.module.css';

const TimeSelectionDay = ({ day, i, onPaint, deltaTime }) => {
  let slotHeightClassName = styles.height_15;
  if (deltaTime === 30) {
    slotHeightClassName = styles.height_30;
  } else if (deltaTime === 60) {
    slotHeightClassName = styles.height_60;
  }

  return (
    <Hammer
      onPan={(e) => onPaint(e, i)}
      onTap={(e) => onPaint(e, i)}
      direction="DIRECTION_ALL"
    >
      <div className={styles.datebox__container}>
        {groupDaySlots(day, deltaTime).map((slotGroup, i) => (
          <div key={i} className={styles.slot_group}>
            {slotGroup.map((slot, i) => (
              <div
                className={`${
                  slot.available
                    ? slot.selected
                      ? styles.datebox__selected
                      : styles.datebox
                    : styles.datebox__unavailable
                } ${slotHeightClassName} ${styles.timebox}`}
                key={i}
              ></div>
            ))}
            <div className={styles.time_str}>
              {formatSlotTime(slotGroup[0].time)}
            </div>
          </div>
        ))}
      </div>
    </Hammer>
  );
};

const TimeSelection = ({ timeslots, setTimeslots, deltaTime }) => {
  /* Screen size detection */
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);

  const numberOfColumns = Math.floor(dimensions.width / 200);

  const timeslotsToShow = timeslots.slice(0, numberOfColumns);

  // TODO: refactor y offset
  const findTimeIndex = (coords) => {
    return Math.floor((coords.y - 123) / (40 / (60 / deltaTime)));
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
                  j === timeIndex && slot.available
                    ? {
                        ...slot,
                        editLock: true,
                        selected: !slot.selected,
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
        {timeslotsToShow.map((day, i) => (
          <TimeSelectionDay
            day={day}
            i={i}
            onPaint={onPaint}
            key={i}
            deltaTime={deltaTime}
          />
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
