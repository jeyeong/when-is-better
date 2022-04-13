import Head from 'next/head';

import styles from '../../styles/CreateSuccess.module.css';
import { useRouter } from 'next/router';
import { Button } from '@mui/material';

const DOMAIN_NAME = 'https://when-is-better.vercel.app/';

const CreateSuccess = () => {
  const router = useRouter();
  const { event_id } = router.query;

  return (
    <>
      <div className={styles.createsuccess}>
        <h1 className={styles.header_font}>Success</h1>
        <span>Forward this link to your event attendees!</span>
        <div className={styles.margin_top}>
          <Button
            variant="contained"
            style={{
              borderRadius: '20px',
              padding: '0.5rem 0.9rem',
              fontSize: '16px',
              width: '80vw',
              textTransform: 'lowercase',
              backgroundColor: '#fff',
              border: '3px solid #087f5b',
              color: '#000',
            }}
            onClick={() =>
              navigator.clipboard.writeText(
                `${DOMAIN_NAME}form?event_id=${event_id}`
              )
            }
          >
            {`${DOMAIN_NAME}form?event_id=${event_id}`}
          </Button>
        </div>
      </div>
    </>
  );
};

export default CreateSuccess;
