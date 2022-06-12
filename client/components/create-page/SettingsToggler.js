/* Other imports */
import styles from '../../styles/Create.module.css';

const SettingsToggler = ({ showOptions, setShowOptions }) => {
  return (
    <div
      className={`${styles.createpage__settingstoggler} ${
        showOptions ? styles.createpage__settingstoggler__open : ''
      }`}
      onClick={() => setShowOptions(!showOptions)}
    >
      <img src="expand_more.svg" alt="expand more" />
    </div>
  );
};

export default SettingsToggler;
