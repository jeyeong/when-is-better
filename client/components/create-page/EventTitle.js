import styles from '../../styles/Create.module.css';

const EventTitle = ({
  title,
  setTitle,
  titleHeight,
  titleBottomMargin,
  showTitleError,
}) => {
  return (
    <>
      <div
        className={`${styles.createpage__title} ${
          showTitleError ? styles.createpage__title__error : ''
        }`}
        style={{
          height: `${titleHeight}px`,
          marginBottom: `${titleBottomMargin}px`,
        }}
      >
        <input
          placeholder={
            showTitleError
              ? "What's the occasion? (This field is required.)"
              : "What's the occasion?"
          }
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
    </>
  );
};

export default EventTitle;
