/* Library imports */
import { useState } from 'react';
import { Button, Snackbar, Alert } from '@mui/material';
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
const BUTTON_STYLE_ERROR = {
  ...BUTTON_STYLE_ACTIVATED,
  backgroundColor: '#ed4337',
  boxShadow: 'none',
};

const SubmitForm = ({ timeslots, eventID, deltaTime }) => {
  /* Copied state: for the pop up on invalidation */
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /* States */
  const [name, setName] = useState('');
  const [showNameError, setShowNameError] = useState(false);

  /* Submission logic */
  const submitForm = () => {
    if (name.length == 0) {
      setShowNameError(true);
      setTimeout(() => setShowNameError(false), 2500);
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Button
        variant="contained"
        onClick={submitForm}
        className={styles.formpage__steptwobutton}
        style={
          name.length > 0
            ? BUTTON_STYLE_ACTIVATED
            : showNameError
            ? BUTTON_STYLE_ERROR
            : BUTTON_STYLE_DEACTIVATED
        }
      >
        Submit
      </Button>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="YOUR NAME"
        className={`${styles.formpage__namebox} ${
          showNameError ? styles.formpage__namebox__error : ''
        }`}
        style={{ marginTop: '10px' }}
      />

      <Snackbar
        open={showNameError}
        onClose={() => {
          setShowNameError(false);
        }}
        message="Please Enter Your Name"
        severity="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Please Enter Your Name
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SubmitForm;
