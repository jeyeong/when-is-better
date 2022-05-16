import Link from 'next/link';
import { Button } from '@mui/material';
import styles from '../styles/Home.module.css';
import { BasicDatePicker } from '../components/homepage/DatePicker';
import { useState } from 'react';
import { Footer } from '../components/general/Footer';
import { NavBar } from '../components/general/NavBar';
import Router from 'next/router';
import { DateTime } from 'luxon';

const LandingPage = () => {
  const [startDate, _setStartDate] = useState('startDateNotSet');
  const [endDate, _setEndDate] = useState('endDateNotSet');
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const setStartDate = (startDate) => {
    let date = DateTime.fromHTTP(startDate)
      .toLocal()
      .set({ hour: 8, minute: 0 });
    _setStartDate(date.toHTTP());
  };

  const setEndDate = (endDate) => {
    let date = DateTime.fromHTTP(endDate)
      .toLocal()
      .set({ hour: 21, minute: 0 });
    _setEndDate(date.toHTTP());
  };

  const takeToCreatePage = () => {
    if (startDate === 'startDateNotSet' || endDate === 'endDateNotSet') {
      setErrorMsg('Null dates are not allowed');
      setIsInvalidDate(true);
      return;
    }

    const startDateTime = DateTime.fromHTTP(startDate);
    const endDateTime = DateTime.fromHTTP(endDate);
    if (startDateTime > endDateTime) {
      setErrorMsg('End date cannot be before start date');
      setIsInvalidDate(true);
      return;
    }

    Router.push({
      pathname: 'create',
      query: { startDate: startDate, endDate: endDate },
    });
  };

  return (
    <>
      <NavBar />

      <div className="max-width-container">
        <div className={styles.home_box}>
          <div className={styles.image_wrapper}>
            <img
              src="icon.svg"
              alt="Clock Icon Image"
              className={styles.main_image}
            />
          </div>

          <div className={styles.wrapper}>
            <div className="container-padding-lg">
              <h1 className={styles.title}>
                When Is <span className={styles.accented}>Better</span>
              </h1>
            </div>
            <div className="container-padding-lg">
              <p className={styles.description}>
                When Is Better is your hub for scheduling hangouts easily,
                eliminating the hassle of back-and-forth messages so you can get
                back to what matters most.
              </p>
              <p className={styles.description}>
                To get started, on what dates could you hold your event?
              </p>

              <div
                className={`${styles.datepicker_container} ${
                  isInvalidDate ? styles.highlight_red : ''
                }`}
              >
                <BasicDatePicker
                  label="Start"
                  setDate={(val) => setStartDate(val)}
                />
                <BasicDatePicker
                  label="End"
                  setDate={(val) => setEndDate(val)}
                />
              </div>
              <div className={styles.invalid_date}>{errorMsg}</div>

              <div className={styles.center_button}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: '#087f5b',
                    borderRadius: '999px',
                    padding: '0.5rem 2rem',
                    fontSize: '1.4rem',
                  }}
                  onClick={takeToCreatePage}
                >
                  Get Started
                </Button>
                {/* <div>Invalid date</div> */}
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
