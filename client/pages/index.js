import Link from 'next/link'
import { Button } from '@mui/material'

const LandingPage = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <Link href="/create" passHref>
        <Button variant="contained">Start</Button>
      </Link>
    </div>
  )
}

export default LandingPage
