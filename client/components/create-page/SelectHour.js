import React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Menu } from '@mui/material';
import { Button, Snackbar, Alert } from '@mui/material';

const hours = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

const numToFormat = (num) => {
  // Technically noon is 12PM; midnight is 12 AM; confusing AF.
  if (num === 24) {
    return '12 AM Midnight';
  } else if (num === 12) {
    return '12 PM Noon';
  } else {
    if (num < 12) {
      return `${num} AM`;
    } else {
      return `${num % 12} PM`;
    }
  }
};

export const SelectHour = ({ defaultHour, setHour }) => {
  /* popUp state */
  const [popUp, setPopUp] = useState(false);

  const handleChange = (event) => {
    /* This is bad react: setHour is not a hook so much as a hook-wrapper that 
       validates if we should actually call the hook
    */
    const validHourChange = setHour(event.target.value);
    if (!validHourChange) {
      setPopUp(true);
    }
  };

  return (
    <>
      <Box sx={{ minWidth: 200 }}>
        <FormControl fullWidth size="small">
          <Select
            labelId="select-label"
            id="demo-simple-select"
            value={defaultHour}
            onChange={handleChange}
          >
            {hours.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {numToFormat(hour)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Snackbar
        open={popUp}
        onClose={() => {
          setPopUp(false);
        }}
        message="Start Hour has to be before End Hour!"
        severity="error"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="error" sx={{ width: '100%' }}>
          Start Hour has to be before End Hour!
        </Alert>
      </Snackbar>
    </>
  );
};
