import React, { useState } from 'react';
import AdapterLuxon from '@mui/lab/AdapterLuxon';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export const BasicDatePicker = ({ setDate }) => {
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
        label="DatePicker"
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
};
