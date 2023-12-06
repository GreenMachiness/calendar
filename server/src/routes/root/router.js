const { Router } = require('express')
const { index } = require('./controller')

// create a new Router instance
const router = new Router()

// define routes

router.get('/', index)

// exporting router
module.exports = router

