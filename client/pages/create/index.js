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

const BasicDatePicker = () => {
  const [value, setValue] = useState(null)

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        label="Basic example"
        value={value}
        onChange={(newValue) => {
          setValue(newValue)
        }}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  )
}

const DatePickStep = ({ setStep }) => {
  return (
    <div>
      <h1>Pick Your Date Range</h1>
      <h3>Start Date</h3>
      <BasicDatePicker />
      <h3>End Date</h3>
      <BasicDatePicker />
      <div>
        <Button variant="contained" onClick={() => setStep(1)}>
          Continue
        </Button>
      </div>
    </div>
  )
}

const TimeSelectionStep = ({ selections, setSelections }) => {
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
        isSelection: !selections[dayIndex][timeIndex],
      })
    }

    if (!editLock[dayIndex][timeIndex]) {
      setSelections(
        selections.map((day, i) =>
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
    return Math.floor((coords.y - 100) / 40)
  }

  return (
    <div className={styles.timeselection}>
      <h1>Pick Time</h1>
      <div
        className={styles.selection__container}
        onTouchEnd={resetEditLocks}
        onMouseUp={resetEditLocks}
      >
        {selections.map((day, i) => (
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
                >
                  {TIMES[i]}
                </div>
              ))}
            </div>
          </Hammer>
        ))}
      </div>
      <Button variant="contained">Create</Button>
    </div>
  )
}

const CreateForm = () => {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState(
    new Array(4).fill(0).map((day) => Array(12).fill(false))
  )

  if (step === 0) {
    return <DatePickStep setStep={setStep} />
  } else if (step === 1) {
    return (
      <TimeSelectionStep
        selections={selections}
        setSelections={setSelections}
      />
    )
  }
}

export default CreateForm
