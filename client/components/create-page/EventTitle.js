import styles from '../../styles/Create.module.css';

const EventTitle = ({ titleHeight, title, setTitle }) => {
  return (
    <>
      <div
        className={styles.createpage__header}
        style={{ height: `${titleHeight}px` }}
      >
        <input
          placeholder="Your Event Name Here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </>
  );
};

export default EventTitle;
