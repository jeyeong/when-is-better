/*****************
 *    Imports    *
 *****************/

/* Library imports */
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';
import { BsGear } from 'react-icons/bs';

/* Component imports */
import EventTitle from '../../components/create-page/EventTitle';
import EventDescription from '../../components/create-page/EventDescription';
import TimeSelection from '../../components/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';
import { OptionsMenu } from '../../components/create-page/OptionsMenu';
import { Footer } from '../../components/general/Footer';

/* Other imports */
import Head from 'next/head';
import styles from '../../styles/Create.module.css';
import {
  defaultStart,
  defaultEnd,
  MINUTES_15,
  MINUTES_30,
  MINUTES_60,
} from '../../constants.js';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

/******************
 *    Settings    *
 ******************/

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

/* Constants */
const TOP_PADDING = 12; // space above the title
const TITLE_HEIGHT = 60;
const TITLE_BOTTOM_MARGIN = 4;
const DESCRIPTION_BOTTOM_MARGIN = 16;

/****************
 *     Main     *
 ****************/

const CreatePage = () => {
  /* States for user input */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [descriptionBoxHeight, setDescriptionBoxHeight] = useState(46);

  /* States for functionality */
  const [deltaTime, setDeltaTime] = useState(MINUTES_15);
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaTime, true)
  );
  const [timeZone, setTimeZone] = useState('Chicago');
  const [hourRange, setHourRange] = useState([8, 20]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); /* up to and including */

  /* Additional hooks */
  const { query, isReady } = useRouter();

  /* Generate start and end times */
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
      deltaTime,
      true
    );

    setTimeslots(timeslots_arr);
  }, [isReady]);

  console.log('timeslots: ', timeslots);

  /* for stuff below the time select component */
  const [showOptions, setShowOptions] = useState(false);
  const bottomRef = useRef();
  const topRef = useRef();

  /* Define functions to control state of child elements */

  return (
    <div
      className={styles.createpage}
      style={{ paddingTop: `${TOP_PADDING}px` }}
    >
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>

      <div ref={topRef}></div>

      <EventTitle
        title={title}
        setTitle={setTitle}
        titleHeight={TITLE_HEIGHT}
        titleBottomMargin={TITLE_BOTTOM_MARGIN}
      />

      <EventDescription
        bottomMargin={DESCRIPTION_BOTTOM_MARGIN}
        description={description}
        setDescription={setDescription}
      />

      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
        distanceFromTop={
          TOP_PADDING +
          TITLE_HEIGHT +
          TITLE_BOTTOM_MARGIN +
          DESCRIPTION_BOTTOM_MARGIN
        }
      />

      <br />
      <br />

      {/* Bottom settings */}
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
                await sleep(700); /* wait to get to page top first */
                setShowOptions(!showOptions);
              } else {
                setShowOptions(!showOptions);
                await sleep(300); /* wait for menu to render first */
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
          <OptionsMenu
            deltaTime={deltaTime}
            setDeltaTime={setDeltaTime}
            setHourRange={setHourRange}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setTimeZone={setTimeZone}
          />
        </div>
      </div>

      <div ref={bottomRef}></div>

      <Footer />
    </div>
  );
};

export default CreatePage;
