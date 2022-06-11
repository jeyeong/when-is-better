import styles from '../../styles/Form.module.css';

const EventTitle = ({ title, titleBottomMargin }) => {
  return (
    <div
      className={styles.formviewpage__title}
      style={{
        marginBottom: `${titleBottomMargin}px`,
      }}
      id="form-view-title"
    >
      <span>{title}</span>
    </div>
  );
};

export default EventTitle;
