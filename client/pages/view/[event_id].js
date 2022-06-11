import { useState, useEffect } from 'react';
import Head from 'next/head';
import Router, { useRouter } from 'next/router';
import Button from '@mui/material/Button';
import Hammer from 'react-hammerjs';
import { DateTime, Duration } from 'luxon';
import ResultsViewTimeSlots from '../../components/view-page/ResultsViewTimeSlots'
import TimeSlotsAvailable from '../../components/view-page/TimeSlotsAvailable'
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';
import styles from '../../styles/Create.module.css';

import Grid from '@mui/material/Grid';
import { defaultStart, defaultEnd } from '../../constants.js';
import { NavBar } from '../../components/general/NavBar';

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
  
  const [eventRespondents, setEventRespondents] = useState([])

  useEffect(() => {
    if (!('event_id' in query)) {
      return;
    }
    getEventObject(query.event_id).then((res) => {
      setEventRespondents(res.respondents)
      setTimeslots(res.timeslots);
    });
  }, [isReady]);

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
      <Grid container spacing={1} style={{marginTop:'20px'}}>
        <Grid item xs={12} md={6} lg={6}>
          <ResultsViewTimeSlots
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            deltaTime={deltaTime}
            distanceFromTop={39}
            allRespondents={eventRespondents}
            widthExpr={x => {
              if (x > 900) {
                // medium
                return x / 2
              } else {
                return x;
              }
              
            }}
          />
        </Grid>
        <Grid item xs={12} md={6} xl={6}>
          <TimeSlotsAvailable
            timeslots={timeslots}
            timeDelta={deltaDuration}
            allRespondents={eventRespondents}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default CreateForm;
