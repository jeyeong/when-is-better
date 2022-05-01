import Link from 'next/link';
import { Button } from '@mui/material';
import styles from '../styles/Home.module.css';
import { BasicDatePicker } from '../components/homepage/DatePicker';
import { useState } from 'react';
import { Footer } from '../components/general/Footer';
import { NavBar } from '../components/general/NavBar';

const LandingPage = () => {
  const [startDate, setStartDate] = useState('blahstart');
  const [endDate, setEndDate] = useState('blahend');

  return (
    <>
      <NavBar />
      <div className={styles.image_wrapper}>
        <img
          src="icon.svg"
          alt="Clock Icon Image"
          className={styles.main_image}
        />
      </div>

      <div className={styles.wrapper}>
        <div className={styles.diagonal_box_top_left}>
          <div className={styles.undo_diagonal_top_left}>
            <div className={styles.margin_x}>
              <h1 className={styles.title}>
                When Is <span className={styles.accented}>Better</span>
              </h1>
            </div>

            <div className={styles.diagonal_box_top_right}>
              <div className={styles.undo_diagonal_top_right}>
                <div className={styles.margin_x}>
                  <p className={styles.description}>
                    When Is Better is your hub for scheduling hangouts easily,
                    eliminating the hassle of back-and-forth messages so you can
                    get back to what matters most.
                  </p>
                  <p>
                    To get started, on what dates could you hold your event?
                  </p>

                  <div className={styles.flex_and_center}>
                    <BasicDatePicker
                      label="Start"
                      setDate={(val) => setStartDate(val)}
                    />
                    <BasicDatePicker
                      label="End"
                      setDate={(val) => setEndDate(val)}
                    />
                  </div>

                  <div className={styles.center_button}>
                    <Link
                      href={{
                        pathname: '/create',
                        query: { startDate: startDate, endDate: endDate },
                      }}
                      passHref
                    >
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: '#087f5b',
                          borderRadius: '50px',
                          padding: '0.5rem 2rem',
                          fontSize: '1rem',
                        }}
                      >
                        Get Started
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default LandingPage;
