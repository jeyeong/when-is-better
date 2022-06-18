/*****************
 *    Imports    *
 *****************/

/* Library imports */
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';
import Head from 'next/head';

/* Component imports */
import Loading from '../../components/general/Loading';
import Header from '../../components/general/Header';
import EventTitle from '../../components/create-page/EventTitle';
import EventDescription from '../../components/create-page/EventDescription';
import TimeSelection from '../../components/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';
import SettingsToggler from '../../components/create-page/SettingsToggler';
import DeltaTimeSelector from '../../components/create-page/DeltaTimeSelector';
import { OptionsMenu } from '../../components/create-page/OptionsMenu';
import { Footer } from '../../components/general/Footer';

/* Other imports */
import styles from '../../styles/Create.module.css';
import {
  defaultStart,
  defaultEnd,
  MINUTES_15,
  MINUTES_30,
  MINUTES_60,
} from '../../constants.js';
import { generateTimeSlotArray } from '../../models/timeslots';

/******************
 *    Settings    *
 ******************/

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

/* Constants */
const TOP_PADDING = 34; // space above the title
const TITLE_HEIGHT = 60;
const TITLE_BOTTOM_MARGIN = 6;
const DESCRIPTION_BOTTOM_MARGIN = 16;
const TS_CONTAINER_BORDER_WIDTH = 1;
const TS_CONTAINER_TB_PADDING = 25;

const INITIAL_START_HOUR = 8;
const INITIAL_END_HOUR = 21;

/****************
 *     Main     *
 ****************/

const CreatePage = () => {
  /* User Defined States */
  const [title, setTitle] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [description, setDescription] = useState('');

  /* States that user can change via options */
  const [showOptions, setShowOptions] = useState(false);
  const [deltaTime, setDeltaTime] = useState(MINUTES_30);
  const [startHour, _setStartHour] = useState(INITIAL_START_HOUR);
  const [endHour, _setEndHour] = useState(INITIAL_END_HOUR);
  const [startDate, setStartDate] = useState(null); //startDate is a string on the home page because we pass on via HTTP; this differs from the create page's startDate which is a Luxon Datetime object
  const [endDate, setEndDate] = useState(null); // endDate is end of last day

  /* Internal states for logic */
  const deltaDuration = Duration.fromObject({ minutes: deltaTime });
  const [timeslots, setTimeslots] = useState([]);
  const [showTimeslotsError, setShowTimeslotsError] = useState(false);
  const [loadDone, setLoadDone] = useState(false);
  const [loadNextPageDone, setLoadNextPageDone] = useState(false); // Show loader after user presses createEventButton

  /* Additional hooks */
  const { query, isReady } = useRouter();

  /*
   * setStartHour
   *   This wrapper is needed so we modify the startDate object's hour
   *   Returns True if we modified the Hour, False if startHour >= End Hour
   */
  const setStartHour = (newStartHour) => {
    if (newStartHour >= endHour) {
      return false;
    }

    _setStartHour(newStartHour);
    const newStartDate = startDate.set({
      hour: newStartHour,
      minute: 0,
    });
    setStartDate(newStartDate);
    return true;
  };

  const setEndHour = (newEndHour) => {
    if (startHour >= newEndHour) {
      return false;
    }

    _setEndHour(newEndHour);
    const newEndDate = endDate.set({
      hour: newEndHour,
      minute: 0,
    });
    setEndDate(newEndDate);
    return true;
  };

  /* Initial page load */
  useEffect(() => {
    let initialStartDate = DateTime.fromHTTP(query.startDate)
      .toLocal()
      ?.set({ minute: 0, second: 0 });
    let initialEndDate = DateTime.fromHTTP(query.endDate)
      .toLocal()
      ?.set({ minute: 0, second: 0 });

    if (initialStartDate.invalid || initialEndDate.invalid) {
      /* Default date range:
         Start = 08:00 today
         End = 21:00 4 days from today */
      initialStartDate = DateTime.now().set({
        hour: INITIAL_START_HOUR,
        minute: 0,
      });
      initialEndDate = initialStartDate
        .plus({ day: 3 })
        .set({ hour: 21 })
        .toLocal();
      initialStartDate = initialStartDate.toLocal();
    }

    setStartDate(initialStartDate);
    setEndDate(initialEndDate);

    const timeslots_arr = generateTimeSlotArray(
      initialStartDate,
      initialEndDate,
      deltaDuration,
      true
    );

    setTimeslots(timeslots_arr);
    setLoadDone(true);
  }, [isReady]);

  /* Subsequent changes to settings */
  useEffect(() => {
    if (loadDone) {
      const timeslots_arr = generateTimeSlotArray(
        startDate,
        endDate,
        deltaDuration,
        true
      );
      setTimeslots(timeslots_arr);
    }
  }, [startDate, endDate, deltaTime]);

  /* To move window to see options component */
  const bottomRef = useRef();
  const topRef = useRef();

  if (!loadDone || loadNextPageDone) {
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
        className={styles.createpage}
        style={{ paddingTop: `${TOP_PADDING}px` }}
      >
        <div ref={topRef}></div>

        <EventTitle
          title={title}
          setTitle={setTitle}
          titleHeight={TITLE_HEIGHT}
          titleBottomMargin={TITLE_BOTTOM_MARGIN}
          showTitleError={showTitleError}
        />

        <EventDescription
          bottomMargin={DESCRIPTION_BOTTOM_MARGIN}
          description={description}
          setDescription={setDescription}
        />

        <div
          className={`${styles.createpage__tscontainer} ${
            showTimeslotsError ? styles.createpage__tscontainer__error : ''
          }`}
          style={{
            paddingTop: `${TS_CONTAINER_TB_PADDING}px`,
            paddingBottom: `${20}px`,
          }}
        >
          <TimeSelection
            timeslots={timeslots}
            setTimeslots={setTimeslots}
            deltaTime={deltaTime}
            distanceFromTop={
              TOP_PADDING +
              TITLE_HEIGHT +
              TITLE_BOTTOM_MARGIN +
              DESCRIPTION_BOTTOM_MARGIN +
              TS_CONTAINER_BORDER_WIDTH +
              TS_CONTAINER_TB_PADDING
            }
          />
        </div>

        <div className={styles.createpage__bottombar}>
          <CreateEventButton
            timeslots={timeslots}
            start={startDate}
            end={endDate}
            deltaTime={deltaTime}
            title={title}
            description={description}
            showError={showTitleError || showTimeslotsError}
            setShowTitleError={setShowTitleError}
            setShowTimeslotsError={setShowTimeslotsError}
            setLoadNextPageDone={setLoadNextPageDone}
          />

          <DeltaTimeSelector
            deltaTime={deltaTime}
            setDeltaTime={setDeltaTime}
          />

          <SettingsToggler
            showOptions={showOptions}
            setShowOptions={setShowOptions}
          />
        </div>

        <div className={styles.createpage__options_container}>
          {showOptions ? (
            <OptionsMenu
              deltaTime={deltaTime}
              setDeltaTime={setDeltaTime}
              startHour={startHour}
              setStartHour={setStartHour}
              endHour={endHour}
              setEndHour={setEndHour}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              // setTimeZone={setTimeZone}
            />
          ) : (
            ''
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default CreatePage;
