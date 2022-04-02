import React from 'react';

import { DatePicker } from '../components/DatePicker';

/* 
  Component for the host to set which dates to select from, eg. 
  from March 31, 2022 to April 5, 2022 
*/

export const HostConfiguration = () => {
  return (
    <div>
      HostConfiguration
      <DatePicker />
    </div>
  );
};
