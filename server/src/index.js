// Validate environment variables before starting app
require('dotenv').config()
const { checkConfig } = require('./utility/utils')
checkConfig()

const cors = require('cors')
// initialize express
const express = require('express')
const app = express()
const port = 9000

const { pathLogger } = require('./middleware/logger')

// Application level middleware

// cors
app.use(cors()) // To allow cross-origin resource sharing on localhost

// body-parser
  // the client must send a request with the header ("Content-Type": "application/json")
app.use(express.json()) // for parsing application/json body

// logging middleware
app.use(pathLogger)

// serve static files
app.use('/assets', express.static('assets'))

// use the routes
const routes = require('./routes/allRoutes')
app.use('/', routes)

app.listen(port, () => {
  console.log(`server listening on port ${port}`)
})
