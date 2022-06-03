import React from 'react';
import { useState } from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Menu } from '@mui/material';

const times = ['8:00AM', '9:00AM', '10:00AM'];
const hours = [];
for (var i = 0; i < 24; i++) {
  hours.push(i);
}

const numToFormat = (num) => {
  if (num === 0) {
    return 'Midnight';
  } else if (num === 12) {
    return 'Noon';
  } else {
    if (num < 12) {
      return `${num} AM`;
    } else {
      return `${num % 12} PM`;
    }
  }
};

export const SelectHour = ({ defaultHour, setHour, isStartHour }) => {
  const handleChange = (event) => {
    setHour(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
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
  );
};
