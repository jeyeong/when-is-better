import React from 'react';
import styles from '../../styles/OptionsMenu.module.css';

export const OptionsMenu = () => {
  return (
    <div className={styles.options_container}>
      OptionsMenu
      <div>
        <ul>
          <li>start Date</li>
          <li>end Date</li>
          <li>Hours</li>
          <li>Timezone</li>
          <li>Increment</li>
        </ul>
      </div>
    </div>
  );
};
