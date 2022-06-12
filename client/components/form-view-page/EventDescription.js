import styles from '../../styles/Form.module.css';

const EventDescription = ({ description, bottomMargin, titleBottomMargin }) => {
  if (description.length === 0) {
    return (
      <div
        style={{ marginBottom: `${bottomMargin - titleBottomMargin}px` }}
      ></div>
    );
  }

  return (
    <div
      className={styles.formviewpage__description}
      style={{ marginBottom: `${bottomMargin}px` }}
    >
      <span>{description}</span>
    </div>
  );
};

export default EventDescription;
