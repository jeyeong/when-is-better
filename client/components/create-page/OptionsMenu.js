import React from 'react';
import styles from '../../styles/OptionsMenu.module.css';
import { useState } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import MuiToggleButton from '@mui/material/ToggleButton';

import { SelectHour } from '../../components/create-page/SelectHour';
import { BasicDatePicker } from '../homepage/DatePicker';
import { TimeZone } from './TimeZone';
import { Increment } from './Increment';

export const OptionsMenu = ({
  deltaTime,
  setDeltaTime,
  startHour,
  setStartHour,
  endHour,
  setEndHour,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className="container-padding-sm">
      <div className={`${styles.options_container}`}>
        <div>
          <ul className={styles.options_list}>
            <li>
              Start Hour
              <div>
                <SelectHour defaultHour={startHour} setHour={setStartHour} />
              </div>
            </li>
            <li>
              End Hour
              <div>
                <SelectHour defaultHour={endHour} setHour={setEndHour} />
              </div>
            </li>
            <li>
              Start Date
              <div>
                <BasicDatePicker
                  label="Start"
                  setDate={(val) => setStartDate(val)}
                  defaultDate={startDate}
                />
              </div>
            </li>
            <li>
              End Date
              <div>
                <BasicDatePicker
                  label="End"
                  setDate={(val) => setEndDate(val)}
                  defaultDate={endDate}
                />
              </div>
            </li>
            {/* <li>
              Time Zone
              <div>
                <TimeZone
                //  defaultTimeZone={}
                />
              </div>
            </li> */}
          </ul>
        </div>
      </div>
    </div>
  );
};
