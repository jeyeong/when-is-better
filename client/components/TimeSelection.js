import { useEffect, useState } from 'react';
import Hammer from 'react-hammerjs';
import utils from '../components/utils';
const { DateTime } = require('luxon');

import styles from '../styles/TimeSelection.module.css';

/* Constants */
const COLUMN_WIDTH_SM = 125;
const COLUMN_GAP_SM = 25;
const COLUMN_WIDTH_LG = 200;
const COLUMN_GAP_LG = 40;
const TITLE_HEIGHT = 42;
const TITLE_BOTTOM_MARGIN = 16;
const COLUMN_BORDER_WIDTH = 2;

/* Individual time selection columns */
const TimeSelectionDay = ({
  day,
  dateTitle,
  i,
  onPaint,
  columnDimensions,
  deltaTime,
}) => {
  let slotHeightClassName = styles.height_15;
  if (deltaTime === 30) {
    slotHeightClassName = styles.height_30;
  } else if (deltaTime === 60) {
    slotHeightClassName = styles.height_60;
  }

  return (
    <div style={{ width: columnDimensions.width - columnDimensions.gap }}>
      <h4
        className={styles.timeselection__datetitle}
        style={{ height: TITLE_HEIGHT, marginBottom: TITLE_BOTTOM_MARGIN }}
      >
        {dateTitle}
      </h4>
      <Hammer
        onPan={(e) => onPaint(e, i)}
        onTap={(e) => onPaint(e, i)}
        onPress={(e) => onPaint(e, i)}
        direction="DIRECTION_ALL"
      >
        <div className={styles.datebox__container}>
          {groupDaySlots(day, deltaTime).map((slotGroup, i) => (
            <div key={i} className={styles.slot_group}>
              {slotGroup.map((slot, i) => (
                <div
                  className={`${styles.datebox} ${
                    slot.available
                      ? slot.selected
                        ? styles.datebox__selected
                        : ''
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
    </div>
  );
};

const TimeSelection = ({
  timeslots,
  setTimeslots,
  deltaTime,
  distanceFromTop,
}) => {
  /* To detect changes in screen size: re-render component */
  const [dimensions, setDimensions] = useState({
    height: 0,
    width: 0,
  });
  const [columnDimensions, setColumnDimensions] = useState(
    typeof window !== 'undefined'
      ? window.innerWidth > 550
        ? { width: COLUMN_WIDTH_LG, gap: COLUMN_GAP_LG }
        : { width: COLUMN_WIDTH_SM, gap: COLUMN_GAP_SM }
      : {}
  );

  /* Add listener for resizing */
  useEffect(() => {
    const handleScreenChange = () => {
      setDimensions({
        height: window.innerHeight,
        width: window.innerWidth,
      });
    };
    handleScreenChange();
    window.addEventListener('resize', handleScreenChange);
    // screen.orientation.addEventListener('change', handleScreenChange);
  }, []);

  /* Modify column dimensions on resizing */
  useEffect(() => {
    if (dimensions.width > 550) {
      setColumnDimensions({ width: COLUMN_WIDTH_LG, gap: COLUMN_GAP_LG });
    } else {
      setColumnDimensions({ width: COLUMN_WIDTH_SM, gap: COLUMN_GAP_SM });
    }
  }, [dimensions]);

  /* Compute number of columns to show */
  const numberOfColumns = Math.floor(dimensions.width / columnDimensions.width);

  /* Filter timeslots to show */
  const timeslotsToShow = timeslots.slice(0, numberOfColumns);

  /* Finds index associated with y-coordinate */
  const offsetDistance = distanceFromTop + TITLE_HEIGHT + TITLE_BOTTOM_MARGIN;
  const findTimeIndex = (y) => {
    const distanceFromTopOfColumn = y - offsetDistance;
    const numBorders = Math.ceil(distanceFromTopOfColumn / 42);
    return Math.floor(
      (distanceFromTopOfColumn - numBorders * COLUMN_BORDER_WIDTH) /
        (40 / (60 / deltaTime))
    );
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
    const timeIndex = findTimeIndex(e.srcEvent.pageY);

    // Get slot of interest
    const slotToModify = timeslots[dayIndex][timeIndex];

    // Check if the slot is not undefined
    if (!slotToModify) {
      return;
    }

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

  /* Reset locks we placed on selection/deselection, now that the
     mouse/finger has been released. */
  const resetLocks = () => {
    setTimeslots(
      timeslots.map((day) => day.map((slot) => ({ ...slot, editLock: false })))
    );
    setFirstAction({ taken: false, isSelection: false });
  };

  /* Date titles */
  const [dateTitles, setDateTitles] = useState(
    utils.getStringDatesFromArray(timeslots)
  );

  useEffect(() => {
    setDateTitles(utils.getStringDatesFromArray(timeslots));
  }, [timeslots]);

  return (
    <div className={styles.timeselection}>
      <div
        className={styles.timeselection__container}
        style={{ columnGap: columnDimensions.gap }}
        onTouchEnd={resetLocks}
        onMouseUp={resetLocks}
      >
        {timeslotsToShow.map((day, i) => (
          <TimeSelectionDay
            day={day}
            dateTitle={dateTitles[i]}
            i={i}
            onPaint={onPaint}
            columnDimensions={columnDimensions}
            deltaTime={deltaTime}
            key={i}
          />
        ))}
      </div>
    </div>
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
