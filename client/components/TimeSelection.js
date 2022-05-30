import { useEffect, useState } from 'react';
import Hammer from 'react-hammerjs';
import utils from '../components/utils';
const { DateTime } = require('luxon');

import styles from '../styles/TimeSelection.module.css';

/* Constants */
const COLUMN_SETTINGS_SM = {
  width: 115,
  gap: 25,
  padding: 15,
};
const COLUMN_SETTINGS_LG = {
  width: 200,
  gap: 40,
  padding: 100,
};
const DATETITLE_HEIGHT = 42;
const DATETITLE_BOTTOM_MARGIN = 12;
const COLUMN_BORDER_WIDTH = 2;
const LG_SM_THRESHOLD = 800;
const SLOT_HEIGHTS = {
  15: 12.5,
  30: 20,
  60: 40,
};

/* Individual time selection columns */
const TimeSelectionDay = ({
  day,
  dateTitle,
  i,
  onPaint,
  columnDimensions,
  deltaTime,
}) => {
  return (
    <div style={{ width: columnDimensions.width - columnDimensions.gap }}>
      <h4
        className={styles.timeselection__datetitle}
        style={{
          height: DATETITLE_HEIGHT,
          marginBottom: DATETITLE_BOTTOM_MARGIN,
        }}
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
          {utils.groupDaySlots(day, deltaTime).map((slotGroup, i) => (
            <div key={i} className={styles.slot_group}>
              {slotGroup.map((slot, i) => (
                <div
                  className={`${styles.datebox} ${
                    slot.available
                      ? slot.selected
                        ? styles.datebox__selected
                        : ''
                      : styles.datebox__unavailable
                  } ${styles.timebox}`}
                  style={{
                    height: SLOT_HEIGHTS[deltaTime],
                  }}
                  key={i}
                ></div>
              ))}
              <div className={styles.time_str}>
                {utils.formatSlotTime(slotGroup[0].time)}
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
      ? window.innerWidth > LG_SM_THRESHOLD
        ? COLUMN_SETTINGS_LG
        : COLUMN_SETTINGS_SM
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
  }, []);

  /* Modify column dimensions on resize */
  useEffect(() => {
    if (dimensions.width > LG_SM_THRESHOLD) {
      setColumnDimensions(COLUMN_SETTINGS_LG);
    } else {
      setColumnDimensions(COLUMN_SETTINGS_SM);
    }
  }, [dimensions]);

  /* Offset distance calculation */
  const descriptionBoxHeight =
    typeof document !== 'undefined'
      ? document.querySelector('#createpage__description')?.scrollHeight ?? 0
      : 0;

  const offsetDistance =
    distanceFromTop +
    descriptionBoxHeight +
    DATETITLE_HEIGHT +
    DATETITLE_BOTTOM_MARGIN;

  /* Finds index associated with y-coordinate */
  const findTimeIndex = (y) => {
    const distanceFromTopOfColumn = y - offsetDistance;
    const numBorders = Math.ceil(
      distanceFromTopOfColumn /
        (SLOT_HEIGHTS[deltaTime] * (60 / deltaTime) + COLUMN_BORDER_WIDTH)
    );
    return Math.floor(
      (distanceFromTopOfColumn - numBorders * COLUMN_BORDER_WIDTH - 0.5) /
        SLOT_HEIGHTS[deltaTime]
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

  /* Compute number of columns to show */
  const numberOfColumns = Math.floor(
    (dimensions.width - columnDimensions.padding) / columnDimensions.width
  );

  /* Current page */
  const [page, setPage] = useState(0);
  const maxPage = Math.ceil(timeslots.length / numberOfColumns) - 1;

  useEffect(() => {
    setPage(Math.max(0, Math.min(page, maxPage)));
  }, [dimensions]);

  /* Filter timeslots to show */
  const timeslotsToShow = timeslots.slice(
    page * numberOfColumns,
    (page + 1) * numberOfColumns
  );

  /* Date titles */
  const [dateTitles, setDateTitles] = useState(
    utils.getStringDatesFromArray(timeslots)
  );

  useEffect(() => {
    setDateTitles(utils.getStringDatesFromArray(timeslots));
  }, [timeslots]);

  /* Filter timeslots to show */
  const dateTitlesToShow = dateTitles.slice(
    page * numberOfColumns,
    (page + 1) * numberOfColumns
  );

  return (
    <div className={styles.timeselection}>
      <div
        className={styles.timeselection__container}
        style={{ columnGap: columnDimensions.gap }}
        onTouchEnd={resetLocks}
        onMouseUp={resetLocks}
      >
        <div
          className={`${styles.timeselection__navleft} ${
            page === 0 ? styles.timeselection__nav__grayed : ''
          }`}
          onClick={() => setPage(Math.max(0, page - 1))}
        >
          ◀
        </div>
        {timeslotsToShow.map((day, i) => (
          <TimeSelectionDay
            day={day}
            dateTitle={dateTitlesToShow[i]}
            i={page * numberOfColumns + i}
            onPaint={onPaint}
            columnDimensions={columnDimensions}
            deltaTime={deltaTime}
            key={i}
          />
        ))}
        <div
          className={`${styles.timeselection__navright} ${
            page === maxPage ? styles.timeselection__nav__grayed : ''
          }`}
          onClick={() => setPage(Math.min(maxPage, page + 1))}
        >
          ▶
        </div>
      </div>
    </div>
  );
};

export default TimeSelection;
