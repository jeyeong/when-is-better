/* Library imports */
import { Button } from '@mui/material';
import { DateTime, Duration } from 'luxon';
import Router from 'next/router';

const deltaDuration = Duration.fromObject({ minutes: 60 });

/* Button styles */
const BUTTON_STYLE_ACTIVATED = {
  height: '33px',
  backgroundColor: '#087f5b',
  borderRadius: '50px',
  padding: '6px 60px',
  fontSize: '12px',
  transition: 'background-color 0.3s color 0.3s',
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

const CreateEventButton = ({
  timeslots,
  start,
  end,
  title,
  showError,
  setShowTitleError,
  setShowTimeslotsError,
}) => {
  /* Filter available times */
  const availableTimes = timeslots.map((day) =>
    day.filter((slot) => slot.selected).map((slot) => slot.time.toHTTP())
  );

  /* Check if at least one time is available */
  const atLeastOneTimeAvailable = availableTimes.reduce(
    (acc, cur) => acc || cur.length !== 0,
    false
  );

  /* Validate title */
  const titleValidation = () => {
    if (title.length === 0) {
      setShowTitleError(true);
      setTimeout(() => setShowTitleError(false), 5000);
      return false;
    }
    return true;
  };

  /* Validate timeslots */
  const timeslotsValidation = () => {
    if (!atLeastOneTimeAvailable) {
      setShowTimeslotsError(true);
      setTimeout(() => setShowTimeslotsError(false), 5000);
      return false;
    }
    return true;
  };

  const handleEventCreation = () => {
    titleValidation();
    timeslotsValidation();
  };

  const createEvent = () => {
    const availableTimes = timeslots.map((day) =>
      day.filter((slot) => slot.selected).map((slot) => slot.time.toHTTP())
    );

    const payload = {
      creator: 'uncommon_hacks',
      event_name: 'uncommon_hacks',
      description: 'flames',
      available_times: availableTimes,
      time_start: start.toHTTP(),
      time_end: end.toHTTP(),
      time_interval_min: 60,
    };

    fetch('https://when-is-better-backend.herokuapp.com/event', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        /* Redirect user to page to share link */
        Router.push(`/create-success?event_id=${res.event_id}`);
      });
  };

  return (
    <Button
      variant="contained"
      onClick={handleEventCreation}
      // onClick={createEvent}
      style={
        title.length > 0 && atLeastOneTimeAvailable
          ? BUTTON_STYLE_ACTIVATED
          : showError
          ? BUTTON_STYLE_ERROR
          : BUTTON_STYLE_DEACTIVATED
      }
    >
      Submit
    </Button>
  );
};

export default CreateEventButton;
