import { useState } from 'react';
import Head from 'next/head';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import Hammer from 'react-hammerjs';
import { DateTime, Duration } from 'luxon';
import Link from 'next/link';
import Router from 'next/router';

import { generateTimeSlotArray } from '../../models/timeslots';

import styles from '../../styles/Create.module.css';
import timeslots, { getEventObject } from '../../models/timeslots'

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

const start = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 4,
  hour: 8,
});
const end = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 7,
  hour: 20,
});
const delta_duration = Duration.fromObject({ minutes: 60 });

const TimeSelection = ({ timeslots, setTimeslots }) => {
  const [firstAction, setFirstAction] = useState({
    fixed: false,
    isSelection: false,
  });

  const onPaint = (e, dayIndex) => {
    const timeIndex = findTimeIndex(e.center);

    if (!firstAction.fixed) {
      setFirstAction({
        fixed: true,
        isSelection: !timeslots[dayIndex][timeIndex].selected,
      });
    }

    if (!timeslots[dayIndex][timeIndex].editLock) {
      setTimeslots(
        timeslots.map((day, i) =>
          i === dayIndex
            ? day.map((slot, j) =>
                j === timeIndex && !(firstAction.isSelection && slot.selected)
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
  };

  const resetEditLocks = () => {
    setTimeslots(
      timeslots.map((day) => day.map((slot) => ({ ...slot, editLock: false })))
    );
    setFirstAction({ fixed: false, isSelection: false });
  };

  const findTimeIndex = (coords) => {
    return Math.floor((coords.y - 123) / 40);
  };

  const createEvent = () => {
    const availableTimes = timeslots.map((day) =>
      day.filter((slot) => slot.selected).map((slot) => slot.time.toHTTP())
    );

    const payload = {
      creator: 'uncommon_hacks',
      event_name: 'uncommon_hacks',
      description: 'flames',
      available_times: availableTimes,
      time_start: start.toHTTP(),
      time_end: end.toHTTP(),
      time_interval_min: 60,
    };

    fetch('https://when-is-better-backend.herokuapp.com/event', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);

        /* Redirect user to page to share link */
        Router.push(`/?event_id=${res.event_id}`);
      });
  };

  return (
    <div className={styles.timeselection}>
      <h1 className={styles.timeselection__header}>Pick Time</h1>
      <div className={styles.day__headers}>
        {HARDCODED_DATES.map((date, i) => (
          <h4 key={i}>{date}</h4>
        ))}
      </div>
      <div
        className={styles.selection__container}
        onTouchEnd={resetEditLocks}
        onMouseUp={resetEditLocks}
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
      <Button
        variant="contained"
        onClick={createEvent}
        style={{
          backgroundColor: '#087f5b',
          borderRadius: '50px',
          padding: '0.5rem 2rem',
          fontSize: '1rem',
        }}
      >
        Create Event
      </Button>
    </div>
  );
};

const CreateForm = () => {
  getEventObject('d39ec5')
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(start, end, delta_duration)
  );
  return (
    <>
      <Head>
        {/* for the font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Open+Sans:ital,wght@0,400;0,800;1,400&family=Raleway+Dots&family=Raleway:wght@100;400;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <TimeSelection timeslots={timeslots} setTimeslots={setTimeslots} />
    </>
  );
};

export default CreateForm;
