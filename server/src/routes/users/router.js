// ** express
const { Router } = require('express')

// ** controllers
const {showAll, register, login, showById, updateById, destroyById} = require('./controller')

// ** middleware
const { authenticate } = require('../../middleware/auth')

// create a new Router instance
const router = new Router()

// define routes

/**
 * Retrieves all users.
 * @route GET /users
 * @middleware authenticate
 * @param {number} [req.query.limit] - The number of results to return for pagination (optional)
 * @param {number} [req.query.page] - The page number for pagination (optional)
 * @handler showAll
 * @returns {array} An array of user objects
 */

router.get('/', authenticate, showAll)

/**
 * Registers a new user.
 * @route POST /users/register
 * @param {object} req.body - The data to use to create the new user
 * @param {string} req.body.username
 * @param {string} req.body.password
 * @handler register
 * @returns {object} The response body
 * @returns {string} .message - The response message
 * @returns {object} .data - The created user's data
 * @returns {string} .token - The JWT for the user
 */

router.post('/register', register)

/**
 * Logs in a user.
 * @route POST /users/login
 * @handler login
 * @returns {object} The response body
 * @returns {string} .message - The response message
 * @returns {string} .token - The JWT for the user
 */

router.post('/login', login)

/**
 * Retrieves a user by their ID.
 * @route GET /users/:id
 * @param {string} id - The ID of the user.
 * @handler showById
 * @returns {object} The response body
 * @returns {string} .message - The response message
 * @returns {object} .data - The data for the user
 */

router.get('/:id', showById)

/**
 * Updates a user by their ID.
 * @route PUT /users/:id
 * @middleware authenticate
 * @param {string} id - The ID of the user.
 * @handler updateById
 * @returns {object} The response body
 * @returns {string} .message - The response message
 * @returns {object} .data - The updated data for the user
 */

router.put('/:id', authenticate, updateById)

/**
 * Deletes a user by their ID.
 * @route DELETE /users/:id
 * @middleware authenticate
 * @param {string} id - The ID of the user.
 * @handler destroyById
 * @returns {object} The response body
 * @returns {string} .message - The response message
 */

router.delete('/:id', authenticate, destroyById)

// exporting router
module.exports = router

