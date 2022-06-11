/* Library imports */
import { useState } from 'react';
import { MenuItem, Menu } from '@mui/material';

/* Other imports */
import styles from '../../styles/Create.module.css';

/* Constants */
const deltaTimeOptions = [15, 30, 60];
const deltaTimeToText = {
  15: '15 M',
  30: '30 M',
  60: '1 H',
};

const DeltaTimeSelector = ({ setDeltaTime }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(1);
  const open = Boolean(anchorEl);
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setDeltaTime(deltaTimeOptions[index]);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div
        className={styles.createpage__deltatimeselector}
        onClick={handleClickListItem}
      >
        {deltaTimeToText[deltaTimeOptions[selectedIndex]]}
      </div>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {deltaTimeOptions.map((option, index) => (
          <MenuItem
            key={option}
            selected={index === selectedIndex}
            onClick={(event) => handleMenuItemClick(event, index)}
            style={{
              fontSize: '14px',
            }}
          >
            {deltaTimeToText[option]}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

  return <div className={styles.createpage__deltatimeselector}>30 M</div>;
};

export default DeltaTimeSelector;
