import { useState } from 'react';
import styles from '../../styles/Create.module.css';

const EventTitle = ({ titleHeight }) => {
  const [eventName, setEventName] = useState('');

  return (
    <>
      <div
        className={styles.createpage__header}
        style={{ height: titleHeight }}
      >
        <input
          placeholder="Your Event Name Here"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
    </>
  );
};

export default EventTitle;
