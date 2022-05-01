import { useState } from 'react';
import { DateTime, Duration } from 'luxon';

import styles from '../../styles/Create.module.css';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

import TimeSelection from '../../components/create-page/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';

import { BsGear } from 'react-icons/bs';

/* Constants */
const TITLE_HEIGHT = '45px';

const start = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 4,
  hour: 8,
});

const end = DateTime.fromObject({
  year: 2022,
  month: 4,
  day: 7,
  hour: 20,
});

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
  getEventObject('d39ec5');
  const [timeslots, setTimeslots] = useState(
    generateTimeSlotArray(start, end, delta_duration)
  );

  const [input, setInput] = useState('');

  return (
    <div className={styles.createpage}>
      <CreateTitle />
      <TimeSelection timeslots={timeslots} setTimeslots={setTimeslots} />
      <div className={styles.button_container}>
        <div>
          <input
            placeholder="John Doe"
            value={input}
            className={styles.input}
            onInput={(e) => setInput(e.target.value)}
          />
        </div>
        <CreateEventButton timeslots={timeslots} />
        <div className={styles.gear_wrapper}>
          <BsGear size={30} />
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
