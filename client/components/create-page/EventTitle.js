import styles from '../../styles/Create.module.css';

const EventTitle = ({ title, setTitle, titleHeight, titleBottomMargin }) => {
  return (
    <>
      <div
        className={styles.createpage__header}
        style={{
          height: `${titleHeight}px`,
          marginBottom: `${titleBottomMargin}px`,
        }}
      >
        <input
          placeholder="What's the occasion?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </>
  );
};

export default EventTitle;
