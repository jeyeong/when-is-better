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

/* Other imports */
import Head from 'next/head';
import styles from '../../styles/Create.module.css';
import { defaultStart, defaultEnd } from '../../constants.js';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

/******************
 *    Settings    *
 ******************/

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

/* Constants */
const TOP_PADDING = 12; // space above the title
const TITLE_HEIGHT = 60;
const DESCRIPTION_BOTTOM_MARGIN = 16;

/* make deltaDuration programmatic */
const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;
const deltaTime = MINUTES_15;
const deltaDuration = Duration.fromObject({ minutes: deltaTime });

/****************
 *     Main     *
 ****************/

const CreatePage = () => {
  /* startDate is beginning of first day, endDate is end of last day */
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);

  /* States */
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionBoxHeight, setDescriptionBoxHeight] = useState(46);
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaDuration, true)
  );

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
      deltaDuration,
      true
    );

    setTimeslots(timeslots_arr);
  }, [isReady]);

  /* for stuff below the time select component */
  const [name, setName] = useState('');
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
        titleHeight={TITLE_HEIGHT}
        title={title}
        setTitle={setTitle}
      />

      <EventDescription
        bottomMargin={DESCRIPTION_BOTTOM_MARGIN}
        description={description}
        setDescription={setDescription}
        setDescriptionBoxHeight={setDescriptionBoxHeight}
      />

      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
        distanceFromTop={
          TOP_PADDING +
          TITLE_HEIGHT +
          descriptionBoxHeight +
          DESCRIPTION_BOTTOM_MARGIN
        }
      />

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
                await sleep(200); /* wait to get to page top first */
                setShowOptions(!showOptions);
              } else {
                setShowOptions(!showOptions);
                await sleep(200); /* wait for menu to render first */
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
    </div>
  );
};

export default CreatePage;
