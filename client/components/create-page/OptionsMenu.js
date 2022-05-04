import React from 'react';
import styles from '../../styles/OptionsMenu.module.css';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { useState } from 'react';

export const OptionsMenu = () => {
  const marks = [
    {
      value: 15,
      label: '15',
      scaledValue: 1,
    },
    {
      value: 30,
      label: '30',
      scaledValue: 2,
    },
    {
      value: 60,
      label: '60',
      scaledValue: 3,
    },
  ];

  function valuetext(value) {
    return `${value}°C`;
  }

  const DEFAULT_TIME_INTERVAL = 15;
  const [timeInterval, setTimeInterval] = useState(DEFAULT_TIME_INTERVAL);
  return (
    <div className="container-padding-sm">
      <div className={`${styles.options_container}`}>
        <div>
          <ul className={styles.options_list}>
            <li>start Date</li>
            <li>end Date</li>
            <li>Hour Start</li>
            <li>Hour End</li>
            <li>Timezone: react-timezone-select</li>
            <li>
              Increment
              {/* <Box>
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
                  onChange={(e, val) => setTimeInterval(val)}
                  value={timeInterval}
                />
              </Box> */}
              {/* for even spacing: https://stackoverflow.com/questions/61792449/material-ui-slider-changing-values-using-scale */}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
