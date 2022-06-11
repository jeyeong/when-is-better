import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid'
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Hammer from 'react-hammerjs';
import { DateTime, Duration } from 'luxon';
import TimeSelection from '../../components/TimeSelection';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';
import styles from '../../styles/Create.module.css';
import { NavBar } from '../../components/general/NavBar';

import { defaultStart, defaultEnd } from '../../constants.js';
import { Typography } from '@mui/material';

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
  const [event_id, setEventId] = useState();
  
  const [eventName, setEventName] = useState()
  const [responderName, setResponderName] = useState()
  const [description, setDescription] = useState()

  useEffect(() => {
    if (!('event_id' in query)) {
      return;
    }
    setEventId(query.event_id);
    getEventObject(query.event_id).then((res) => {
      setEventName(res.event_name);
      setDescription(res.description);
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
      name: responderName,
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

        Router.push(`/view/${event_id}`);
      });
  };

  return (
    <>
      <NavBar />
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
      <Typography variant='h5' align="center" style={{
        paddingTop:'10px',
        height: '40px'
      }}>
        {eventName}
      </Typography>
      <Typography variant='body1' align="center" style={{
        height:'30px'
      }}>
        {description}
      </Typography>
      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
        distanceFromTop={60 + 40 + 30}
      />
      <Grid container direction="row" justifyContent="space-evenly" alignItems="center">
        <Grid item xs={8} md={6}>
          <input
            type="text"
            value={responderName}
            onInput={(e) => setResponderName(e.target.value)}
            placeholder="John Doe"
            className={styles.input_name}
          />
        </Grid>
        <Grid item >
          <Button
            variant="contained"
            onClick={submitForm}
            style={{
              width:'100%',
              backgroundColor: '#087f5b',
              borderRadius: '50px',
              padding: '0.5rem 2rem',
              fontSize: '1rem',
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateForm;
