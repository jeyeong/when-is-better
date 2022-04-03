import Head from 'next/head';

import styles from '../../styles/CreateSuccess.module.css';

const CreateSuccess = () => {
  return (
    <>
      <Head>
        {/* for the font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Open+Sans:ital,wght@0,400;0,800;1,400&family=Raleway+Dots&family=Raleway:wght@100;400;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={styles.createsuccess}>
        <h1>Success</h1>
        <span>Forward this link to your event attendees!</span>
        <div className={styles.createsuccess__linkbox}></div>
      </div>
    </>
  );
};

export default CreateSuccess;