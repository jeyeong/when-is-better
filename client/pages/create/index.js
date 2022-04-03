import { useState } from 'react'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import AdapterLuxon from '@mui/lab/AdapterLuxon'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import DatePicker from '@mui/lab/DatePicker'
import Hammer from 'react-hammerjs'

import styles from '../../styles/Create.module.css'

const TIMES = [
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
  '6pm',
  '7pm',
  '8pm',
]

const TimeSelection = ({ timeslot, setTimeslot }) => {
  const [editLock, setEditLock] = useState(
    new Array(4).fill(0).map((day) => Array(12).fill(false))
  )
  const [firstAction, setFirstAction] = useState({
    fixed: false,
    isSelection: false,
  })

  const onPaint = (e, dayIndex) => {
    const timeIndex = findTimeIndex(e.center)

    if (!firstAction.fixed) {
      setFirstAction({
        fixed: true,
        isSelection: !timeslot[dayIndex][timeIndex],
      })
    }

    if (!editLock[dayIndex][timeIndex]) {
      setTimeslot(
        timeslot.map((day, i) =>
          i === dayIndex
            ? day.map((time, j) =>
                j === timeIndex && !(firstAction.isSelection && time)
                  ? !time
                  : time
              )
            : day
        )
      )
      setEditLock(
        editLock.map((day, i) =>
          i === dayIndex
            ? day.map((time, j) => (j === timeIndex ? true : time))
            : day
        )
      )
    }
  }

  const resetEditLocks = () => {
    setEditLock(new Array(4).fill(0).map((day) => Array(12).fill(false)))
    setFirstAction({ fixed: false, isSelection: false })
  }

  const findTimeIndex = (coords) => {
    return Math.floor((coords.y - 95) / 40)
  }

  const createEvent = () => {
    fetch('https://when-is-better-backend.herokuapp.com/', {
      method: 'GET',
      mode: 'cors',
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
      })
  }

  return (
    <div className={styles.timeselection}>
      <h1 className={styles.timeselection__header}>Pick Time</h1>
      <div
        className={styles.selection__container}
        onTouchEnd={resetEditLocks}
        onMouseUp={resetEditLocks}
      >
        {timeslot.map((day, i) => (
          <Hammer
            onPan={(e) => onPaint(e, i)}
            onTap={(e) => onPaint(e, i)}
            direction="DIRECTION_ALL"
            key={i}
          >
            <div className={styles.datebox__container}>
              {day.map((time, i) => (
                <div
                  className={time ? styles.datebox__selected : styles.datebox}
                  key={i}
                >
                  {TIMES[i]}
                </div>
              ))}
            </div>
          </Hammer>
        ))}
      </div>
      <Button variant="contained" onClick={createEvent}>
        Create
      </Button>
    </div>
  )
}

const CreateForm = () => {
  // const timeslotInit = () => (

  // )

  const [timeslot, setTimeslot] = useState(
    new Array(4).fill(0).map((day) => Array(12).fill(false))
  )

  return <TimeSelection timeslot={timeslot} setTimeslot={setTimeslot} />
}

export default CreateForm
