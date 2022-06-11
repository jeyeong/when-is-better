/* Library imports */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CircularProgress } from '@mui/material';
import Head from 'next/head';
import { DateTime, Duration } from 'luxon';

/* Component imports */
import Header from '../../components/general/Header';
import EventTitle from '../../components/form-view-page/EventTitle';
import EventDescription from '../../components/form-view-page/EventDescription';
import TimeSelection from '../../components/TimeSelection';
import SubmitForm from '../../components/form-view-page/SubmitForm';

/* Other imports */
import styles from '../../styles/Form.module.css';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';
import { defaultStart, defaultEnd } from '../../constants.js';

/* Constants */
const TOP_PADDING = 45; // space above the title
const TITLE_BOTTOM_MARGIN = 18;
const DESCRIPTION_BOTTOM_MARGIN = 24;
const TS_CONTAINER_BORDER_WIDTH = 1;
const TS_CONTAINER_TB_PADDING = 25;
const MINUTES_60 = 60;

const Form = () => {
  /* States */
  const [timeslots, setTimeslots] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [loadDone, setLoadDone] = useState(false);
  const [validEventID, setValidEventID] = useState(true);

  /* Additional hooks */
  const { query, isReady } = useRouter();

  /* Get data */
  useEffect(() => {
    if (isReady) {
      const event_id = query.event_id;
      if (!event_id) {
        setValidEventID(false);
      } else {
        getEventObject(event_id).then((res) => {
          if (!res) {
            setValidEventID(false);
          } else {
            setTimeslots(res.timeslots);
            setEventDetails({
              title: res.event_name ?? '<No title>',
              description: res.description ?? '',
              deltaTime: res.deltatime ?? MINUTES_60,
            });
            setLoadDone(true);
          }
        });
      }
    }
  }, [isReady]);

  /* Wrong event ID view */
  if (!validEventID) {
    return <InvalidEventID />;
  }

  /* Loading view */
  if (!loadDone) {
    return <Loading />;
  }

  return (
    <>
      <Header />

      <div
        className={styles.formviewpage}
        style={{ paddingTop: `${TOP_PADDING}px` }}
      >
        <div
          className={styles.formviewpage__topsection}
          id="form-view-page-topsection"
        >
          <EventTitle
            title={eventDetails.title}
            titleBottomMargin={TITLE_BOTTOM_MARGIN}
          />

          <EventDescription
            description={eventDetails.description}
            bottomMargin={DESCRIPTION_BOTTOM_MARGIN}
            titleBottomMargin={TITLE_BOTTOM_MARGIN}
          />
        </div>

        <div
          className={styles.formviewpage__tscontainer}
          style={{
            paddingTop: `${TS_CONTAINER_TB_PADDING}px`,
            paddingBottom: `${20}px`,
          }}
        >
          <TimeSelection
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            deltaTime={eventDetails.deltaTime}
            distanceFromTop={
              TOP_PADDING + TS_CONTAINER_BORDER_WIDTH + TS_CONTAINER_TB_PADDING
            }
            formMode={true}
          />
        </div>

        <div style={{ marginTop: '24px', marginBottom: '30px' }}>
          <SubmitForm
            timeslots={timeslots}
            eventID={query.event_id}
            deltaTime={eventDetails.deltaTime}
          />
        </div>
      </div>
    </>
  );
};

// const Form2 = () => {
//   const [timeslots, setTimeslots] = useState([]);
//   const { query, isReady } = useRouter();

//   useEffect(() => {
//     if (!('event_id' in query)) {
//       return;
//     }
//     event_id = query.event_id;
//     getEventObject(query.event_id).then((res) => {
//       setTimeslots(res.timeslots);
//     });
//   }, [isReady]);

//   const submitForm = () => {
//     const availableTimes = [];

//     for (let day of timeslots) {
//       for (let slot of day) {
//         if (slot.available && slot.selected) {
//           availableTimes.push(slot.time.toHTTP());
//         }
//       }
//     }

//     const payload = {
//       event_id: event_id,
//       name: 'james',
//       comments: 'placeholder',
//       selected_times: availableTimes,
//       time_interval_min: 60,
//     };

//     fetch('https://when-is-better-backend.herokuapp.com/response', {
//       method: 'POST',
//       mode: 'cors',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload),
//     })
//       .then((res) => res.json())
//       .then((res) => {
//         console.log(res);

//         Router.push(`/view/d39ec5`);
//       });
//   };

//   return (
//     <>
//       <Head>
//         {/* for the font */}
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link
//           rel="preconnect"
//           href="https://fonts.gstatic.com"
//           crossOrigin="true"
//         />
//         <link
//           href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Open+Sans:ital,wght@0,400;0,800;1,400&family=Raleway+Dots&family=Raleway:wght@100;400;900&display=swap"
//           rel="stylesheet"
//         />
//       </Head>
//       <h1
//         className={styles.timeselection__header}
//         style={{ display: 'flex', justify: 'center' }}
//       >
//         WhenIs<span style={{ color: '#087f5b' }}>Better</span>
//       </h1>
//       <TimeSelection
//         timeslots={timeslots}
//         setTimeslots={setTimeslots}
//         deltatime={deltatime}
//         distanceFromTop={39}
//       />
//       <Button
//         variant="contained"
//         onClick={submitForm}
//         style={{
//           backgroundColor: '#087f5b',
//           borderRadius: '50px',
//           padding: '0.5rem 2rem',
//           fontSize: '1rem',
//         }}
//       >
//         Submit
//       </Button>
//     </>
//   );
// };

const InvalidEventID = () => (
  <>
    <Header />
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        placeItems: 'center',
      }}
    >
      <img
        src="../close.svg"
        alt="wrong event ID"
        style={{ height: '100px', marginBottom: '24px' }}
      />
      <p style={{ fontSize: '15px', fontWeight: '600' }}>Invalid Event ID</p>
    </div>
  </>
);

const Loading = () => (
  <>
    <Header />
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <CircularProgress color="success" />
    </div>
  </>
);

export default Form;
