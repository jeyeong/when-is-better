import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DateTime, Duration } from 'luxon';

import styles from '../../styles/Create.module.css';
import { generateTimeSlotArray, getEventObject } from '../../models/timeslots';

import TimeSelection from '../../components/create-page/TimeSelection';
import CreateEventButton from '../../components/create-page/CreateEventButton';

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
  <h1 className={styles.createpage__header} style={{ height: TITLE_HEIGHT }}>
    Pick Time
  </h1>
);

const CreatePage = () => {
  const [timeslots, setTimeslots] = useState(generateTimeSlotArray(default_start, default_end, delta_duration));
  const {query, isReady} = useRouter();

  useEffect(() => {
    console.log("QUERY")
    if (!(("startDate" in query) && "endDate" in query)) {
      return
    }
    const startDate = DateTime.fromHTTP(query.startDate).toLocal()
    const endDate = DateTime.fromHTTP(query.endDate).toLocal()
    const timeslots_arr = generateTimeSlotArray(startDate, endDate, delta_duration)
    console.log(timeslots_arr)
    // console.log(`first timeslot: ${timeslots_arr[0][0].time.toHTTP()}`)
    setTimeslots(timeslots_arr)  
    
  }, [isReady])

  return (
    <div className={styles.createpage}>
      <CreateTitle />
      <TimeSelection timeslots={timeslots} setTimeslots={setTimeslots} />
      <CreateEventButton timeslots={timeslots} />
    </div>
  );
};

export default CreatePage;
