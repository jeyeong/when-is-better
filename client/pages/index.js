import Link from 'next/link'
import { Button } from '@mui/material'

const LandingPage = () => {
  return (
    <div className={styles.main_container}>
      <h1>Landing Page</h1>
      <Link href="/create">
        <Button variant="contained">Start</Button>
      </Link>
    </div>
  )
}

export default LandingPage
