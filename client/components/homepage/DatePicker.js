import React from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const color = '#087f5b';

// https://codesandbox.io/s/material-demo-forked-wm16xh?file=/demo.tsx:2962-3033

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color: '#333',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeMedium: {
          color: '#087f5b',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#333',
        },
      },
    },
  },
});

export const BasicDatePicker = ({ label, setDate, defaultDate }) => {
  const [value, setValue] = React.useState(defaultDate);

  const onChange = (newValue) => {
    setValue(newValue);
    if (newValue != null) {
      setDate(newValue);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <DatePicker
          label={label}
          value={value}
          onChange={onChange}
          renderInput={(params) => (
            <TextField {...params} fullWidth size="small" />
          )}
          sx={{
            color: '#087f5b',
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  );
};
