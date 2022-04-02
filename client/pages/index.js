import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';

import { Header } from '../components/Header';
import { DayPicker } from '../components/DayPicker';
import { TimePicker } from '../components/TimePicker';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

export default function Home() {
  return (
    <div className={styles.main_container}>
      <DayPicker />
      {/* <Header />
      <DayPicker interval={interval} />
      <TimePicker interval={interval}/> */}
    </div>
  );
}
