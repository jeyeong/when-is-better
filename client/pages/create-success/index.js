import * as React from 'react'
import styles from '../../styles/CreateSuccess.module.css';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';
import { NavBar } from '../../components/general/NavBar';
import { Footer } from '../../components/general/Footer';
import { useState } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const DOMAIN_NAME = 'https://whenisbetter.tech/';

// source: https://mui.com/material-ui/react-snackbar/
const Alert = React.forwardRef(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
        <span align="center">
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
        <Snackbar
          open={copied}
          autoHideDuration={2000}
          onClose={() => {setCopied(false)}}
          message="Copied!"
          severity="success"
          anchorOrigin={{vertical: "top", horizontal: "center"}}
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
