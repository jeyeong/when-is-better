import Link from "next/link";
import { Button } from "@mui/material";
import styles from "../styles/Home.module.css";

import { FaCalendarAlt } from "react-icons/fa";
import { IconContext } from "react-icons";
import Head from "next/head";

const LandingPage = () => {
  return (
    <>
      <Head>
        {/* for the font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Open+Sans:ital,wght@0,400;0,800;1,400&family=Raleway+Dots&family=Raleway:wght@100;400;900&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className={styles.hero_placeholder}></div>

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
                    When Is Better is your hub for scheduling your hangouts
                    easily, eliminating the hassle of back-and-forth messages so
                    you can get back to what matters most.
                  </p>
                  <div className={styles.center_button}>
                    <Link href="/create">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#087f5b",
                          "border-radius": "50px",
                          padding: "1rem 2rem",
                          fontSize: "1rem",
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
    </>
  );
};

export default LandingPage;
