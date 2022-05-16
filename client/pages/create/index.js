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
import styles from '../../styles/Create.module.css';
import { defaultStart, defaultEnd } from '../../constants.js';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

/******************
 *    Settings    *
 ******************/

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

/* Constants */
const TOP_MARGIN = '12px'; // space above the title
const TITLE_HEIGHT = '60px';
const DESCRIPTION_BOTTOM_MARGIN = '16px';

/* make deltaDuration programmatic */
const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;
const deltaTime = MINUTES_60;
const deltaDuration = Duration.fromObject({ minutes: deltaTime });

/****************
 *     Main     *
 ****************/

const CreatePage = () => {
  /* startDate is beginning of first day, endDate is end of last day */
  let [startDate, setStartDate] = useState(defaultStart);
  let [endDate, setEndDate] = useState(defaultEnd);

  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaDuration, true)
  );
  const { query, isReady } = useRouter();

  useEffect(() => {
    if (!('startDate' in query && 'endDate' in query)) {
      return;
    }
    startDate = DateTime.fromHTTP(query.startDate).toLocal();
    endDate = DateTime.fromHTTP(query.endDate).toLocal();
    setStartDate(startDate);
    setEndDate(endDate);
    const timeslots_arr = generateTimeSlotArray(
      startDate,
      endDate,
      deltaDuration,
      true
    );
    setTimeslots(timeslots_arr);
  }, [isReady]);

  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  const bottomRef = useRef();
  const topRef = useRef();

  return (
    <div className={styles.createpage} style={{ marginTop: TOP_MARGIN }}>
      <div ref={topRef}></div>
      <EventTitle titleHeight={TITLE_HEIGHT} />
      <EventDescription bottomMargin={DESCRIPTION_BOTTOM_MARGIN} />

      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
      />

      {/* Bottom settings */}
      <div className={styles.button_container}>
        <div className={styles.flex}>
          <input
            type="text"
            value={input}
            onInput={(e) => setInput(e.target.value)}
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
