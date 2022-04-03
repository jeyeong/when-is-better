// const BasicDatePicker = () => {
//   const [value, setValue] = useState(null)

//   return (
//     <LocalizationProvider dateAdapter={AdapterLuxon}>
//       <DatePicker
//         label="Basic example"
//         value={value}
//         onChange={(newValue) => {
//           setValue(newValue)
//         }}
//         renderInput={(params) => <TextField {...params} />}
//       />
//     </LocalizationProvider>
//   )
// }

// const DatePickStep = ({ setStep }) => {
//   return (
//     <div>
//       <h1>Pick Your Date Range</h1>
//       <h3>Start Date</h3>
//       <BasicDatePicker />
//       <h3>End Date</h3>
//       <BasicDatePicker />
//       <div>
//         <Button variant="contained" onClick={() => setStep(1)}>
//           Continue
//         </Button>
//       </div>
//     </div>
//   )
// }

