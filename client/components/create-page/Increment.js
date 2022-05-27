import React from 'react';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled } from '@mui/material/styles';
import MuiToggleButton from '@mui/material/ToggleButton';

/* Define our own styling for the toggle buttons
https://stackoverflow.com/questions/69707814/set-selected-background-color-of-mui-togglebutton
*/
const ToggleButton = styled(MuiToggleButton)({
  '&.Mui-selected, &.Mui-selected:hover': {
    color: 'white',
    backgroundColor: '#087f5b',
  },
});

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

export const Increment = () => {
  const timeInterval = '15';

  const handleChange = () => {
    throw 'to-do';
  };

  const control = {
    value: timeInterval,
    onChange: handleChange,
    exclusive: true,
  };

  return (
    <>
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
    </>
  );
};
