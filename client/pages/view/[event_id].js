/* Library imports */
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Grid } from '@mui/material';
import { DateTime, Duration } from 'luxon';

/* Component imports */
import Loading from '../../components/general/Loading';
import Header from '../../components/general/Header';
import EventTitle from '../../components/form-view-page/EventTitle';
import EventDescription from '../../components/form-view-page/EventDescription';
import ResultsViewTimeSlots from '../../components/view-page/ResultsViewTimeSlots';
import TimeSlotsAvailable from '../../components/view-page/TimeSlotsAvailable';

/* Other imports */
import styles from '../../styles/Form.module.css';
import { getEventObject } from '../../models/timeslots';

/* Constants */
const TOP_PADDING = 45; // space above the title
const TITLE_BOTTOM_MARGIN = 18;
const DESCRIPTION_BOTTOM_MARGIN = 24;
const TS_CONTAINER_BORDER_WIDTH = 1;
const TS_CONTAINER_TB_PADDING = 25;
const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;
const deltaTime = MINUTES_60;
const deltaDuration = Duration.fromObject({ minutes: deltaTime });

const CreateForm = () => {
  /* States */
  const [timeslots, setTimeslots] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [eventRespondents, setEventRespondents] = useState([]);
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
            setEventRespondents(res.respondents);
            setEventDetails({
              title: res.event_name || '<No title>',
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
      <Header />

      <Grid
        container
        className={styles.formviewpage}
        style={{
          paddingTop: `${TOP_PADDING}px`,
          marginBottom: '40px',
          rowGap: '24px',
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          style={{
            display: 'flex',
            flexDirection: 'column',
            placeItems: 'center',
          }}
        >
          <div className={styles.formviewpage__topsection}>
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
            <ResultsViewTimeSlots
              timeslots={timeslots}
              setTimeslots={setTimeslots}
              deltaTime={deltaTime}
              distanceFromTop={39}
              allRespondents={eventRespondents}
              widthExpr={(x) => {
                if (x > 900) {
                  // medium
                  return x / 2;
                } else {
                  return x;
                }
              }}
            />
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <TimeSlotsAvailable
            timeslots={timeslots}
            timeDelta={eventDetails.deltaTime}
            allRespondents={eventRespondents}
          />
        </Grid>
      </Grid>
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

export default CreateForm;
