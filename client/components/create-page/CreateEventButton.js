/* Library imports */
import { useState } from "react"
import Router from "next/router"
import { Button, Snackbar, Alert } from "@mui/material"

/* Other imports */
import styles from "../../styles/Create.module.css"

/* Button styles */
const BUTTON_STYLE_ACTIVATED = {
  height: "33px",
  width: "160px",
  backgroundColor: "#087f5b",
  borderRadius: "50px",
  fontSize: "12px",
  transition: "background-color 0.3s color 0.3s",
  boxShadow: "none",
}
const BUTTON_STYLE_DEACTIVATED = {
  ...BUTTON_STYLE_ACTIVATED,
  backgroundColor: "#d9d9d9",
  boxShadow: "none",
  color: "#000000c0",
}
const BUTTON_STYLE_ERROR = {
  ...BUTTON_STYLE_ACTIVATED,
  backgroundColor: "#ed4337",
  boxShadow: "none",
}

const CreateEventButton = ({
  timeslots,
  start,
  end,
  deltaTime,
  title,
  description,
  showError,
  setShowTitleError,
  setShowTimeslotsError,
  setLoadNextPageDone,
}) => {
  /* Copied state: for the pop up on invalidation */
  const [copied, setCopied] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  // /* Stage two */
  // const [stageTwo, setStageTwo] = useState(false);
  // const [name, setName] = useState('');

  /* Filter available times */
  const availableTimes = timeslots.map((day) =>
    day.filter((slot) => slot.selected).map((slot) => slot.time.toHTTP())
  )

  /* Check if at least one time is available */
  const atLeastOneTimeAvailable = availableTimes.reduce(
    (acc, cur) => acc || cur.length !== 0,
    false
  )

  /* Validate title */
  const titleValidation = () => {
    if (title.length === 0) {
      setShowTitleError(true)
      setTimeout(() => setShowTitleError(false), 5000)

      setErrorMessage("Please Enter a Title")
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      return false
    }
    return true
  }

  /* Validate timeslots */
  const timeslotsValidation = () => {
    if (!atLeastOneTimeAvailable) {
      setShowTimeslotsError(true)
      setTimeout(() => setShowTimeslotsError(false), 5000)

      setErrorMessage("Please Select Times")
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      return false
    }
    return true
  }

  const createEvent = () => {
    const payload = {
      creator: "placeholder",
      event_name: title,
      description: description,
      available_times: availableTimes,
      time_start: start.toHTTP(),
      time_end: end.toHTTP(),
      time_interval_min: deltaTime,
    }

    fetch("https://when-is-better-backend.herokuapp.com/event", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((res) => {
        /* Redirect user to page to share link */
        Router.push(`/create-success?event_id=${res.event_id}`)
      })

    setLoadNextPageDone(true)
  }

  const handleEventCreation = () => {
    const timeslotsValidated = timeslotsValidation()
    const titleValidated = titleValidation()

    if (titleValidated && timeslotsValidated) {
      createEvent()
    }
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleEventCreation}
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
      <Snackbar
        open={copied}
        onClose={() => {
          setCopied(false)
        }}
        message="Copied!"
        severity="error"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default CreateEventButton
