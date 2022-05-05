import React from 'react';
import { AdapterLuxon } from '@mui/x-date-pickers/AdapterLuxon';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const color = 'red';
const theme = createTheme({
  components: {
    MuiIconButton: {
      styleOverrides: {
        sizeMedium: {
          color,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color,
        },
      },
    },
  },
});

export const BasicDatePicker = ({ label, setDate }) => {
  const [value, setValue] = React.useState(null);

  const onChange = (newValue) => {
    setValue(newValue);
    if (newValue != null) {
      setDate(newValue.toHTTP());
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
    </ThemeProvider>
  );
};
