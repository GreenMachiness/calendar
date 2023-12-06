const { Router } = require('express')

// import routes
const root = require('./root/router')
const users = require('./users/router')

// create a new Router instance
const allRouters = new Router()

// create base routes
allRouters.use('/', root)
allRouters.use('/users', users)

// exporting router
module.exports = allRouters