/*****************
 *    Imports    *
 *****************/

/* Library imports */
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';

/* Component imports */
import Header from '../../components/general/Header';
import EventTitle from '../../components/create-page/EventTitle';
import EventDescription from '../../components/create-page/EventDescription';
import TimeSelection from '../../components/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';
import SettingsToggler from '../../components/create-page/SettingsToggler';
import DeltaTimeSelector from '../../components/create-page/DeltaTimeSelector';
import { OptionsMenu } from '../../components/create-page/OptionsMenu';

/* Other imports */
import Head from 'next/head';
import styles from '../../styles/Create.module.css';
import { defaultStart, defaultEnd } from '../../constants.js';
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

/* make deltaDuration programmatic */
const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;

/****************
 *     Main     *
 ****************/

const CreatePage = () => {
  /* States */
  const [startDate, setStartDate] = useState(null); // startDate is beginning of first day
  const [endDate, setEndDate] = useState(null); // endDate is end of last day
  const [title, setTitle] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [description, setDescription] = useState('');
  const [deltaTime, setDeltaTime] = useState(MINUTES_30);
  const deltaDuration = Duration.fromObject({ minutes: deltaTime });
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaDuration, true)
  );
  const [showTimeslotsError, setShowTimeslotsError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  /* Additional hooks */
  const { query, isReady } = useRouter();

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
      initialStartDate = DateTime.now().set({ hour: 8, minute: 0 });
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
    setInitialLoadDone(true);
  }, [isReady]);

  /* Subsequent changes to settings */
  useEffect(() => {
    if (initialLoadDone) {
      const timeslots_arr = generateTimeSlotArray(
        startDate,
        endDate,
        deltaDuration,
        true
      );
      setTimeslots(timeslots_arr);
    }
  }, [startDate, endDate, deltaTime]);

  /* For stuff below the time select component */
  const bottomRef = useRef();
  const topRef = useRef();

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
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
            showTimeslotsError={showTimeslotsError}
          />
        </div>

        <div className={styles.createpage__bottombar}>
          <CreateEventButton
            timeslots={timeslots}
            start={startDate}
            end={endDate}
            title={title}
            showError={showTitleError || showTimeslotsError}
            setShowTitleError={setShowTitleError}
            setShowTimeslotsError={setShowTimeslotsError}
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

        {/* Bottom settings */}
        {/*
      <div className={styles.button_container}>
        <div className={styles.flex}>
          <input
            type="text"
            value={name}
            onInput={(e) => setName(e.target.value)}
            placeholder="John Doe"
            className={styles.input_name}
          />
        </div>
        <div className={styles.flex}>
          <CreateEventButton
            timeslots={timeslots}
            start={startDate}
            end={endDate}
          />
        </div>
        <div className="flex">
          <button
            className={styles.btn_test}
            onClick={async () => {
              if (showOptions) {
                topRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest',
                });
                await sleep(200); // wait to get to page top first
                setShowOptions(!showOptions);
              } else {
                setShowOptions(!showOptions);
                await sleep(200); // wait for menu to render first
                bottomRef.current.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start',
                  inline: 'nearest',
                });
              }
            }}
          >
            <BsGear size={30} />
          </button>
        </div>
      </div>

      <div className={`${showOptions ? '' : 'hide'} w_100 `}>
        <div className="container-padding-lg">
          <OptionsMenu />
        </div>
      </div>

      <div ref={bottomRef}></div>
      */}

        <br />
      </div>
    </>
  );
};

export default CreatePage;
