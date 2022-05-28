import Head from 'next/head';

import styles from '../../styles/CreateSuccess.module.css';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { NavBar } from '../../components/general/NavBar';
import { Footer } from '../../components/general/Footer';
import { useState } from 'react';

const DOMAIN_NAME = 'https://when-is-better.vercel.app/';

const CreateSuccess = () => {
  const router = useRouter();
  const { event_id } = router.query;
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    console.log('yo');
    setCopied(true);
    navigator.clipboard.writeText(`${DOMAIN_NAME}form/${event_id}`);
  };

  return (
    <>
      <NavBar />
      <div className={styles.createsuccess}>
        <h1 className={styles.header_font}>Success</h1>
        <span>
          Click to copy, then forward this link to your event attendees!
        </span>
        <div className={styles.margin_top}>
          <button
            className={`btn ${styles.hover__animation}`}
            onClick={copyToClipboard}
          >
            {`${DOMAIN_NAME}form/${event_id}`}
          </button>
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
