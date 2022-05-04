import React from 'react';
import styles from '../../styles/OptionsMenu.module.css';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

export const OptionsMenu = () => {
  const marks = [
    {
      value: 15,
      label: '15',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 60,
      label: '60',
    },
  ];

  function valuetext(value) {
    return `${value}°C`;
  }
  return (
    <div className="container-padding-sm">
      <div className={`${styles.options_container}`}>
        OptionsMenu
        <div>
          <ul>
            <li>start Date</li>
            <li>end Date</li>
            <li>Hour Start</li>
            <li>Hour End</li>
            <li>Timezone: react-timezone-select</li>
            <li>Increment: 15, 30, 60</li>

            <div>
              <Box>
                {/* <Box> */}
                <Slider
                  aria-label="Custom marks"
                  defaultValue={60}
                  getAriaValueText={valuetext}
                  step={null}
                  marks={marks}
                  min={15}
                  max={60}
                  valueLabelDisplay="auto"
                  sx={{ width: 200, color: 'green' }}
                />
              </Box>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};
