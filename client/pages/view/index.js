import { useState, useEffect } from 'react';
import Head from 'next/head';
import Button from '@mui/material/Button';
import Hammer from 'react-hammerjs';
import { DateTime, Duration } from 'luxon';

import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

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

const TimeSelection = ({ timeslots, setTimeslots }) => {
  return (
    <div className={styles.timeselection}>
      <h1 className={styles.timeselection__header}>
        WhenIs<span style={{ color: '#087f5b' }}>Better</span>
      </h1>
      <div className={styles.day__headers}>
        {HARDCODED_DATES.map((date, i) => (
          <h4 key={i}>{date}</h4>
        ))}
      </div>
      <div className={styles.selection__container}>
        {timeslots.map((day, i) => (
          <Hammer direction="DIRECTION_ALL" key={i}>
            <div className={styles.datebox__container}>
              {day.map((slot, i) => (
                <div
                  className={
                    slot.available
                      ? slot.people_available.length >= 1
                        ? slot.people_available.length >= 2
                          ? slot.people_available.length >= 3
                            ? styles.intensity__3
                            : styles.intensity__2
                          : styles.intensity__1
                        : styles.intensity__0
                      : styles.datebox__unavailable
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
    </div>
  );
};

const CreateForm = () => {
  const [timeslots, setTimeslots] = useState([]);

  useEffect(() => {
    getEventObject('d39ec5').then((res) => {
      setTimeslots(res.timeslots);
    });
  }, []);

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
