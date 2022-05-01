import { Button } from '@mui/material';
import { DateTime, Duration } from 'luxon';
import Router from 'next/router';

/* (Temporary) constats */
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

const CreateEventButton = ({ timeslots }) => {
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
      onClick={createEvent}
      style={{
        backgroundColor: '#087f5b',
        borderRadius: '9999px',
        height: '40px',
        width: '100%',
        fontSize: '16px',
      }}
    >
      Create
    </Button>
  );
};

export default CreateEventButton;
