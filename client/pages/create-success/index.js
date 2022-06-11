import styles from '../../styles/CreateSuccess.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { NavBar } from '../../components/general/NavBar';
import { Footer } from '../../components/general/Footer';

const DOMAIN_NAME = 'https://when-is-better.vercel.app/';

const CreateSuccess = () => {
  /* Get event ID */
  const { query, isReady } = useRouter();

  /* Craft form link */
  const link = `${DOMAIN_NAME}form/${query.event_id}`;

  /* Copied state */
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <NavBar />
      <div className={styles.createsuccess}>
        <h1>Success</h1>
        <span style={{ marginTop: '12px' }}>
          Click to copy, then forward this link to your event attendees!
        </span>
        <div style={{ marginTop: '20px' }}>
          {isReady ? (
            <Button
              variant="contained"
              className={styles.createsuccess__link}
              onClick={copyToClipboard}
            >
              {link}
            </Button>
          ) : null}
        </div>
        <div
          className={
            copied
              ? styles.createsuccess__copiedmessage
              : styles.createsuccess__copiedmessage__hidden
          }
          style={{ marginTop: '18px' }}
        >
          Copied
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CreateSuccess;

// <Button
// variant="contained"
// style={{
//   borderRadius: '20px',
//   padding: '0.5rem 0.9rem',
//   fontSize: '16px',
//   width: '80vw',
//   textTransform: 'lowercase',
//   backgroundColor: '#fff',
//   border: '3px solid #087f5b',
//   color: '#000',
// }}
// onClick={() =>
//   navigator.clipboard.writeText(`${DOMAIN_NAME}form/${event_id}`)
// }
// >
// {`${DOMAIN_NAME}form/${event_id}`}
// </Button>
