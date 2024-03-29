import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import { DateTime, Duration } from 'luxon';

/* this mutates A, so pass a clone */
const setMinusMultiple = (A, B) => {
  B.forEach((i) => {
    const idx = A.indexOf(i);
    if (idx >= 0) {
      A.splice(idx, 1);
    }
  });
  return A;
};

const TimeSlotAvailable = ({ timeslot, timeDelta, allRespondents }) => {
  const localTime = timeslot.time.toLocal();
  const timeStart = localTime.toFormat('h:mm').toLowerCase();
  const deltaDuration = Duration.fromObject({ minutes: timeDelta });
  const timeEnd = localTime.plus(deltaDuration).toFormat('h:mma').toLowerCase();
  const date = localTime.toFormat('ccc LLL d');
  const people_unavailable = setMinusMultiple(
    [...allRespondents],
    timeslot.people_available
  );
  const percent_available_str =
    // Math.max(allRespondents.length, 1) prevents divide-by-zero error
    (
      timeslot.people_available.length / Math.max(allRespondents.length, 1)
    ).toLocaleString(undefined, { style: 'percent' });
  return (
    <Grid item xs={12}>
      <Paper
        elevation={5}
        style={{
          padding: '0.5em',
        }}
      >
        <Grid container alignItems="center" width="100%">
          <Grid item xs={8}>
            <Typography component="div" variant="h6">
              {timeStart}-{timeEnd} {date}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography align="right" component="div">
              <Chip
                label={`${percent_available_str} Available`}
                style={{
                  backgroundColor: `rgba(145,224,155,${
                    timeslot.people_available.length /
                    Math.max(allRespondents.length, 1)
                  })`,
                }}
              />
            </Typography>
          </Grid>
        </Grid>
        <Divider></Divider>
        <Typography color="text.secondary" variant="caption">
          Available
        </Typography>
        <Typography>{timeslot.people_available.join(', ')}</Typography>
        <Typography color="text.secondary" variant="caption">
          Unavailable
        </Typography>
        <Typography>{people_unavailable.join(', ')}</Typography>
      </Paper>
    </Grid>
  );
};

const TimeSlotsAvailable = ({ timeslots, timeDelta, allRespondents }) => {
  let selected = [];
  if (timeslots !== undefined) {
    selected = timeslots.flat().filter((ts) => ts.selected);
  }
  return (
    <div
      style={{
        width: '90%',
        maxWidth: '500px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5" style={{ marginBottom: '12px' }}>
        Availabilities
      </Typography>
      <Divider />
      <Grid container spacing={2}>
        {selected.map((ts, i) => (
          <TimeSlotAvailable
            timeslot={ts}
            timeDelta={timeDelta}
            allRespondents={allRespondents}
            key={i}
          />
        ))}
      </Grid>
    </div>
  );
};

export default TimeSlotsAvailable;
