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
  const onPaint = (e, dayIndex) => {
    // console.log(e.center)
    const timeIndex = findTimeIndex(e.center)
    setSelections(
      selections.map((day, i) =>
        i === dayIndex
          ? day.map((time, j) => (time === 1 || j === timeIndex ? 1 : 0))
          : day
      )
    )
  }

  const findTimeIndex = (coords) => {
    return Math.floor((coords.y - 100) / 40)
  }

  return (
    <div className={styles.container__major}>
      {selections.map((day, i) => (
        <Hammer
          onPan={(e) => onPaint(e, i)}
          onTap={(e) => onPaint(e, i)}
          direction="DIRECTION_ALL"
        >
          <div className={styles.container}>
            {day.map((time, i) => (
              <div
                className={
                  time === 1 ? styles.datebox__selected : styles.datebox
                }
                // onMouseEnter={(_) => handleMouseEnter(i)}
                // onTouchStart={(_) => handleMouseEnter(i)}
                // onTouchMove={(_) => handleMouseEnter(i)}
              >
                {TIMES[i]}
              </div>
            ))}
          </div>
        </Hammer>
      ))}
    </div>
  )
}

const CreateForm = () => {
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState(
    new Array(4).fill(0).map((day) => Array(12).fill(0))
  )

  if (step === 0) {
    return <DatePickStep setStep={setStep} />
  } else if (step === 1) {
    return (
      <div>
        <h1>Pick Time</h1>
        <TimeSelectionStep
          selections={selections}
          setSelections={setSelections}
        />
      </div>
    )
  }
}

export default CreateForm
