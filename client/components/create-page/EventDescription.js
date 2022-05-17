import styles from '../../styles/Create.module.css';

const EventDescription = ({
  bottomMargin,
  description,
  setDescription,
  setDescriptionBoxHeight,
}) => {
  const handleResize = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    setDescriptionBoxHeight(e.target.scrollHeight);
  };

  return (
    <div
      className={styles.createpage__description}
      style={{ marginBottom: `${bottomMargin}px` }}
    >
      <textarea
        value={description}
        placeholder="Description (optional)"
        onKeyDown={handleResize}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default EventDescription;
