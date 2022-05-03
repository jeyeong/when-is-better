import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';

import styles from '../../styles/Create.module.css';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

import TimeSelection from '../../components/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';

import { BsGear } from 'react-icons/bs';
import { OptionsMenu } from '../../components/create-page/OptionsMenu';

/* Constants */
const TITLE_HEIGHT = '45px';

const defaultStart = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 4,
  hour: 8,
}).setZone('America/Chicago');

const defaultEnd = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 7,
  hour: 20,
}).setZone('America/Chicago');

/* make deltaDuration programmatic */
const MINUTES_15 = 15;
const MINUTES_30 = 30;
const MINUTES_60 = 60;
const deltaTime = MINUTES_15;
const deltaDuration = Duration.fromObject({ minutes: deltaTime });

const CreateTitle = () => (
  <>
    <h1 className={styles.createpage__header} style={{ height: TITLE_HEIGHT }}>
      Your Event Name Here
    </h1>
    {/* <h2>Your Event Description</h2> */}
  </>
);

const CreatePage = () => {
  /* startDate is beginning of first day, endDate is end of last day */
  let [startDate, setStartDate] = useState(defaultStart)
  let [endDate, setEndDate] = useState(defaultEnd)
  
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(defaultStart, defaultEnd, deltaDuration, true)
  );
  const { query, isReady } = useRouter();

  useEffect(() => {
    if (!('startDate' in query && 'endDate' in query)) {
      return;
    }
    startDate = DateTime.fromHTTP(query.startDate).toLocal()
    endDate = DateTime.fromHTTP(query.endDate).toLocal()
    setStartDate(startDate)
    setEndDate(endDate)
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

  return (
    <div className={styles.createpage}>
      <CreateTitle />
      <TimeSelection
        timeslots={timeslots}
        setTimeslots={setTimeslots}
        deltaTime={deltaTime}
      />

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
          <CreateEventButton timeslots={timeslots} start={startDate} end={endDate}/>
        </div>
        <div className={styles.flex}>
          <button
            className={styles.btn_test}
            onClick={() => setShowOptions(!showOptions)}
          >
            <BsGear size={30} />
          </button>
        </div>
      </div>

      {showOptions ? <OptionsMenu /> : <div></div>}
    </div>
  );
};

export default CreatePage;
