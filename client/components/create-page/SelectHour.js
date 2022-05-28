import React from 'react';
import { useState } from 'react';

const times = ['8:00AM', '9:00AM', '10:00AM'];

export const SelectHour = () => {
  const [hour, setHour] = useState('8:00AM');

  return (
    <label>
      <select value={hour} onChange={(e) => setHour(e.target.value)}>
        {times.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <div>Selected hour: {hour}</div>
    </label>
  );
};
