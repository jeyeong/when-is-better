const express = require('express')
const cors = require('cors')

// App config
const app = express()
const port = 8001

// Middlewares
app.use(express.json())
app.use(cors({ origin: '*' }))

// API endpoints
app.get('/', (req, res) => res.status(200).send('Better when-is-good API'))

app.listen(port, () => console.log(`Listening. Port: ${port}`))
