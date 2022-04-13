import { useState } from 'react';
import Hammer from 'react-hammerjs';

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

const TimeSelection = ({ timeslots, setTimeslots }) => {
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

  return (
    <>
      <div className={styles.day__headers}>
        {HARDCODED_DATES.map((date, i) => (
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
              {day.map((slot, i) => (
                <div
                  className={
                    slot.selected ? styles.datebox__selected : styles.datebox
                  }
                  key={i}
                >
                  {TIMES[i]}
                </div>
              ))}
            </div>
          </Hammer>
        ))}
      </div>
    </>
  );
};

export default TimeSelection;
