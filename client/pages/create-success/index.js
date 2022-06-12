import styles from '../../styles/CreateSuccess.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Snackbar, Alert } from '@mui/material';
import { NavBar } from '../../components/general/NavBar';
import { Footer } from '../../components/general/Footer';

const DOMAIN_NAME = 'https://whenisbetter.tech/';

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
        <span
          style={{ marginTop: '12px', textAlign: 'center', padding: '0 4px' }}
        >
          Click to copy, then forward this link to your event attendees!
        </span>
        <div style={{ marginTop: '20px' }}>
          {isReady ? (
            <Button
              variant="contained"
              onClick={copyToClipboard}
              className={styles.createsuccess__link}
              style={{
                border: 'none',
                borderRadius: '20px',
                textTransform: 'none',
                fontFamily: 'sans-serif',
                fontSize: '15px',
                backgroundColor: '#087f5b',
                paddingLeft: '25px',
                paddingRight: '25px',
              }}
            >
              {link}
            </Button>
          ) : null}
        </div>
        <Snackbar
          open={copied}
          onClose={() => {
            setCopied(false);
          }}
          message="Copied!"
          severity="success"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Copied!
          </Alert>
        </Snackbar>
      </div>
      <Footer />
    </>
  );
};

export default CreateSuccess;
