import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'

/* this mutates A, so pass a clone */
const setMinusMultiple = (A, B) => {
    B.forEach(i => {
        const idx = A.indexOf(i);
        if (idx >= 0) {
            A.pop(idx);
        }
    })
    return A
    
}

const TimeSlotAvailable = ({
    timeslot,
    timeDelta,
    allRespondents
}) => {
    const localTime = timeslot.time.toLocal()
    const timeStart = localTime.toFormat('hh:mm')
    const timeEnd = localTime.plus(timeDelta).toFormat('hh:mm')
    const date = localTime.toFormat("ccc LLL d")
    const people_unavailable = setMinusMultiple([...allRespondents], timeslot.people_available)
    return (
        <Grid item xs={12} md={6} lg={4}>
            <Paper elevation={5} style={{
                padding: '0.5em'
            }}>
                <Typography variant="h6">
                    {timeStart}-{timeEnd} {date}
                </Typography>
                <Divider></Divider>
                <Typography
                    color="text.secondary"
                    variant="caption"
                >
                    Available
                </Typography>
                <Typography>
                    {timeslot.people_available.join(", ")}
                </Typography>
                <Typography
                    color="text.secondary"
                    variant="caption"
                >
                    Unavailable
                </Typography>
                <Typography>
                    {people_unavailable.join(", ")}
                </Typography>
            </Paper>
        </Grid>
    )
}

const TimeSlotsAvailable = ({
    timeslots,
    timeDelta,
    allRespondents,
}) => {

    let selected = []
    if (timeslots !== undefined) {
        selected = timeslots.flat().filter(ts => ts.selected)
    }
    console.log(selected)
    return (
        <div>
            <Typography variant="h4">
                Availabilities
            </Typography>
            <Divider/>
            <Grid container spacing={2}>
                {selected.map(ts => (
                    <TimeSlotAvailable
                        timeslot={ts}
                        timeDelta={timeDelta}
                        allRespondents={allRespondents}
                    />
                ))}
            </Grid>
        </div>       
    )
}

export default TimeSlotsAvailable