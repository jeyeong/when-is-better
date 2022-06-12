/* Library imports */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { DateTime, Duration } from 'luxon';

/* Component imports */
import Loading from '../../components/general/Loading';
import Header from '../../components/general/Header';
import EventTitle from '../../components/form-view-page/EventTitle';
import EventDescription from '../../components/form-view-page/EventDescription';
import TimeSelection from '../../components/TimeSelection';
import SubmitForm from '../../components/form-view-page/SubmitForm';

/* Other imports */
import styles from '../../styles/Form.module.css';
import { getEventObject } from '../../models/timeslots';

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
    return (
      <>
        <Header />
        <Loading />
      </>
    );
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <title>WhenIsBetter</title>
      </Head>

      <Header />

      <div
        className={styles.formpage}
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

        <div style={{ marginTop: '24px', paddingBottom: '30px' }}>
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

export default Form;
