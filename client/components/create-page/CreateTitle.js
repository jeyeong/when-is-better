import styles from '../../styles/Create.module.css';

const CreateTitle = ({ titleHeight }) => {
  return (
    <>
      <h1 className={styles.createpage__header} style={{ height: titleHeight }}>
        Your Event Name Here
      </h1>
      {/* <h2>Your Event Description</h2> */}
      {/* can you also make the y_difference a program variable */}
    </>
  );
};

export default CreateTitle;
