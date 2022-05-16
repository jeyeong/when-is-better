import styles from '../../styles/Create.module.css';

const EventDescription = ({ bottomMargin }) => {
  const handleResize = (e) => {
    e.target.style.height = 'inherit';
    e.target.style.height = `${e.target.scrollHeight}px`;
    console.log(e.target.scrollHeight);
  };

  return (
    <div
      className={styles.createpage__description}
      style={{ marginBottom: bottomMargin }}
    >
      <textarea placeholder="Description (optional)" onKeyDown={handleResize} />
    </div>
  );
};

export default EventDescription;
