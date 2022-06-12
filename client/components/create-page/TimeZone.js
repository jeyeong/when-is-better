import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import React from 'react';
import TimezoneSelect from 'react-timezone-select';
import { useState } from 'react';

const timezones = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24,
];

export const TimeZone = ({ defaultTimeZone }) => {
  const [selectedTimezone, setSelectedTimezone] = useState({});
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
            value={1}
            onChange={handleChange}
          >
            {timezones.map((hour) => (
              <MenuItem key={hour} value={hour}>
                {hour}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <div className="select-wrapper">
        <TimezoneSelect
          value={selectedTimezone}
          onChange={setSelectedTimezone}
        />
      </div>
    </>
  );
};
