import { boxSizing } from '@mui/system';
import { useEffect, useState } from 'react';
import Hammer from 'react-hammerjs';
import utils from '../utils';
const { DateTime } = require('luxon');

import styles from '../../styles/TimeSelection.module.css'

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
  dayIndex,
  dateTitle,
  columnDimensions,
  deltaTime,
  num_responses,
  handleSlotClick,
  setHoverSlot,
}) => {
  const handleClick = (groupIndex, timeIndexInGroup) => {
    const groupSize = 60 / deltaTime;
    const timeIndex = groupIndex * groupSize + timeIndexInGroup
    handleSlotClick(dayIndex, timeIndex)
  }

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
        <div className={styles.datebox__container}>
          {groupDaySlots(day, deltaTime).map((slotGroup, groupIndex) => (
            <div key={groupIndex} className={styles.slot_group}>
              {slotGroup.map((slot, timeIndex) => (
                <div
                  style = {{
                    // TODO: box expands
                    border: slot.selected ? '2.5px solid black' : '',
                    // height: SLOT_HEIGHTS[deltaTime],
                    // boxSizing: 'border-box'
                  }}
                >
                  <div
                    className={`${styles.datebox} ${
                      slot.available
                        ? styles.intensity__3
                        : styles.datebox__unavailable
                    } ${styles.timebox}`}
                    style={{
                      height: SLOT_HEIGHTS[deltaTime],
                      opacity: slot.available
                        ? slot.people_available.length / num_responses                    
                        : 1,
                    }}
                    key={timeIndex}
                    onClick={() => handleClick(groupIndex, timeIndex)}
                  ></div>
                </div>
              ))}
              <div 
                className={styles.time_str}
                style={{
                  pointerEvents: 'none'
                }}
              >
                {formatSlotTime(slotGroup[0].time)}
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

const ResultsViewTimeSlots = ({
  timeslots,
  setTimeslots,
  deltaTime,
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
  
  const max_available = timeslots.reduce((max, day) => day.reduce((day_max, slot) => day_max > slot.people_available.length ? day_max : slot.people_available.length, max),0)

  /* Filter timeslots to show */
  const dateTitlesToShow = dateTitles.slice(
    page * numberOfColumns,
    (page + 1) * numberOfColumns
  );
  
  const handleSlotClick = (dayIndex, timeIndex) => {
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

  return (
    <div className={styles.timeselection}>
      <div
        className={styles.timeselection__container}
        style={{ columnGap: columnDimensions.gap }}
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
            dayIndex={i}
            dateTitle={dateTitlesToShow[i]}
            i={page * numberOfColumns + i}
            columnDimensions={columnDimensions}
            deltaTime={deltaTime}
            key={i}
            num_responses={max_available}
            handleSlotClick={handleSlotClick}
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

export default ResultsViewTimeSlots;

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
