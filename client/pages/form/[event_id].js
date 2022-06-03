import { useState, useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Hammer from 'react-hammerjs';
import { DateTime, Duration } from 'luxon';
import TimeSelection from '../../components/TimeSelection';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';
import styles from '../../styles/Create.module.css';

import { defaultStart, defaultEnd } from '../../constants.js';

const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;
const deltaTime = MINUTES_60;
const deltaDuration = Duration.fromObject({ minutes: deltaTime });

const CreateForm = () => {
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaDuration, true)
  );
  const { query, isReady } = useRouter();
  let event_id = undefined;

  useEffect(() => {
    if (!('event_id' in query)) {
      return;
    }
    event_id = query.event_id;
    getEventObject(query.event_id).then((res) => {
      setTimeslots(res.timeslots);
    });
  }, [isReady]);

  const submitForm = () => {
    const availableTimes = [];

    for (let day of timeslots) {
      for (let slot of day) {
        if (slot.available && slot.selected) {
          availableTimes.push(slot.time.toHTTP());
        }
      }
    }

    const payload = {
      event_id: event_id,
      name: 'james',
      comments: 'flames',
      selected_times: availableTimes,
      time_interval_min: 60,
    };

    fetch('https://when-is-better-backend.herokuapp.com/response', {
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

        Router.push(`/view?event_id=d39ec5`);
      });
  };

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
      <h1 className={styles.timeselection__header} style={{ display: 'flex', justify: 'center' }}>
        WhenIs<span style={{ color: '#087f5b' }}>Better</span>
      </h1>
      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
        distanceFromTop={39}
      />
      <Button
        variant="contained"
        onClick={submitForm}
        style={{
          backgroundColor: '#087f5b',
          borderRadius: '50px',
          padding: '0.5rem 2rem',
          fontSize: '1rem',
        }}
      >
        Submit
      </Button>
    </>
  );
};

export default CreateForm;
