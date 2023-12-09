const { Router } = require('express')

// Import routes
const root = require('./root/router')
const users = require('./users/router')
const tasks = require('./tasks/router') 

// Create a new Router instance
const allRouters = new Router()

// Create base routes
allRouters.use('/', root)
allRouters.use('/users', users)
allRouters.use('/tasks', tasks) 

// Exporting router
module.exports = allRouters
