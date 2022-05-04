import React from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

// const ToggleButton = styled(MuiToggleButton)({
//   '&.Mui-selected, &.Mui-selected:hover': {
//     color: 'white',
//     backgroundColor: '#087f5b',
//   },
// });

export const BasicDatePicker = ({ label, setDate }) => {
  const [value, setValue] = React.useState(null);

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
              color: '#087f5b',
            }}
          />
        )}
      />
    </LocalizationProvider>
  );
};
