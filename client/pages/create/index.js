import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';

import styles from '../../styles/Create.module.css';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

import TimeSelection from '../../components/create-page/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';

import { BsGear } from 'react-icons/bs';
import { OptionsMenu } from '../../components/create-page/OptionsMenu';

/* Constants */
const TITLE_HEIGHT = '45px';

const default_start = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 4,
  hour: 8,
}).setZone("America/Chicago");

const default_end = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 7,
  hour: 20,
}).setZone("America/Chicago");

const delta_duration = Duration.fromObject({ minutes: 60 });

const CreateTitle = () => (
  <>
    <h1 className={styles.createpage__header} style={{ height: TITLE_HEIGHT }}>
      Your Event Name Here
    </h1>
    {/* <h2>Your Event Description</h2> */}
  </>
);

const CreatePage = () => {
  const [timeslots, setTimeslots] = useState(generateTimeSlotArray(default_start, default_end, delta_duration));
  const {query, isReady} = useRouter();

  useEffect(() => {
    if (!(("startDate" in query) && "endDate" in query)) {
      return
    }
    const startDate = DateTime.fromHTTP(query.startDate).toLocal()
    const endDate = DateTime.fromHTTP(query.endDate).toLocal()
    const timeslots_arr = generateTimeSlotArray(startDate, endDate, delta_duration)
    // console.log(`first timeslot: ${timeslots_arr[0][0].time.toHTTP()}`)
    setTimeslots(timeslots_arr)  
    
  }, [isReady])

  const [input, setInput] = useState('');
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className={styles.createpage}>
      {/* <h1 className={styles.timeselection__header}>
        WhenIs<span style={{ color: '#087f5b' }}>Better</span>
      </h1> */
      /* this is a breaking change due to the y-difference, etc.*/}
      <CreateTitle />
      <TimeSelection timeslots={timeslots} setTimeslots={setTimeslots} />
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
          <CreateEventButton timeslots={timeslots} />
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
