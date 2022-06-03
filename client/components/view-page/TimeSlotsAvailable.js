
const TimeSlotAvailable = ({
    timeslot
}) => {
    return (
        <div>
            {timeslot.time.toHTTP()}: {timeslot.people_available.join(", ")}
        </div>
    )
}

const TimeSlotsAvailable = ({
    timeslots
}) => {

    let selected = []
    if (timeslots !== undefined) {
        selected = timeslots.flat().filter(ts => ts.selected)
    }
    console.log(selected)
    return (
        <div>
            People Available
            {selected.map(ts => (
                <TimeSlotAvailable
                    timeslot={ts}
                />
            ))}
        </div>   
    )
}

export default TimeSlotsAvailable