import { useState } from 'react';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';

export const BasicDatePicker = ({ setDate, label }) => {
  const [value, setValue] = useState(null);

  const onChange = (newValue) => {
    setValue(newValue);
    if (newValue != null) {
      setDate(newValue.toHTTP());
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterLuxon}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        renderInput={(params) => (
          <TextField
            {...params}
            sx={{
              width: 0.4,
              mx: 2,
              color: 'primary.main',
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
