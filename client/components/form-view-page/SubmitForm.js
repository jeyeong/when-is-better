/* Library imports */
import { useState } from 'react';
import { Button } from '@mui/material';
import Router from 'next/router';

/* Other imports */
import styles from '../../styles/Form.module.css';

/* Button styles */
const BUTTON_STYLE_ACTIVATED = {
  height: '33px',
  width: '160px',
  backgroundColor: '#087f5b',
  borderRadius: '50px',
  fontSize: '12px',
  transition: '0.3s',
  boxShadow: 'none',
};
const BUTTON_STYLE_DEACTIVATED = {
  ...BUTTON_STYLE_ACTIVATED,
  backgroundColor: '#d9d9d9',
  boxShadow: 'none',
  color: '#000000c0',
};

const SubmitForm = ({ timeslots, eventID, deltaTime }) => {
  /* States */
  const [stepTwo, setStepTwo] = useState(false);
  const [name, setName] = useState('');

  /* Step 1 submission */
  const advanceToStepTwo = () => setStepTwo(true);

  /* Step 2 submission */
  const submitForm = () => {
    if (name.length == 0) {
      return;
    }

    // Get available times
    const availableTimes = [];
    for (let day of timeslots) {
      for (let slot of day) {
        if (slot.available && slot.selected) {
          availableTimes.push(slot.time.toHTTP());
        }
      }
    }

    // Create payload
    const payload = {
      event_id: eventID,
      name: name,
      comments: 'placeholder',
      selected_times: availableTimes,
      time_interval_min: deltaTime,
    };

    fetch('https://when-is-better-backend.herokuapp.com/response', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        Router.push(`/view/${eventID}`);
      });
  };

  /* Step 1: Select timeslots */
  if (!stepTwo) {
    return (
      <Button
        variant="contained"
        onClick={advanceToStepTwo}
        style={BUTTON_STYLE_ACTIVATED}
      >
        Submit
      </Button>
    );
  }

  /* Step 2: Fill out your name */
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        variant="contained"
        onClick={submitForm}
        className={styles.formpage__steptwobutton}
        style={
          name.length > 0 ? BUTTON_STYLE_ACTIVATED : BUTTON_STYLE_DEACTIVATED
        }
      >
        {name.length > 0 ? 'Submit' : 'One more thing...'}
      </Button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="YOUR NAME"
        className={styles.formpage__namebox}
        style={{ marginTop: '10px' }}
      />
    </div>
  );
};

export default SubmitForm;
