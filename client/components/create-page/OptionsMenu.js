import React from 'react';
import styles from '../../styles/OptionsMenu.module.css';
import Box from '@mui/material/Box';
import { useState } from 'react';

import TimezoneSelect from 'react-timezone-select';

import { styled } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';

/* Define our own styling
https://stackoverflow.com/questions/69707814/set-selected-background-color-of-mui-togglebutton
*/
const ToggleButton = styled(MuiToggleButton)({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: '#087f5b',
  },
});

export const OptionsMenu = () => {
  /* Code for TimeZone */
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  ); // use default timezone of user
  const currTZ = JSON.stringify(selectedTimezone, null, 2);
  console.log('currTZ: ', currTZ);

  /* Code for Time Increment */
  const [timeInterval, setTimeInterval] = useState('15');
  const handleChange = (event, newTimeInterval) => {
    if (newTimeInterval == null) {
      return; /* Prevent users hitting the same button twice --> no null state */
    }
    setTimeInterval(newTimeInterval);
  };

  const children = [
    <ToggleButton value="15" key="15" disableRipple={true}>
      15
    </ToggleButton>,
    <ToggleButton value="30" key="30" disableRipple={true}>
      30
    </ToggleButton>,
    <ToggleButton value="60" key="60" disableRipple={true}>
      60
    </ToggleButton>,
  ];

  const control = {
    value: timeInterval,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <div className="container-padding-sm">
      <div className={`${styles.options_container}`}>
        <div>
          <ul className={styles.options_list}>
            <li>start Date</li>
            <li>end Date</li>
            <li>Hour Start</li>
            <li>Hour End</li>
            <li>
              Timezone
              <div className="select-wrapper">
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
              </div>
            </li>
            <li>
              Increment
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <ToggleButtonGroup size="small" {...control}>
                  {children}
                </ToggleButtonGroup>
              </Box>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
