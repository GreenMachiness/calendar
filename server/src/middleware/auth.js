require('dotenv').config()
const jwt = require('jsonwebtoken')
const { findById } = require('../routes/users/service')

exports.authenticate = async (req, res, next) => {

    if (!process.env.SECRET_KEY) {
    // If the client receives this message it means the SECRET Key is not set
    res.status(500).json({ message: 'Internal Server Error' })
  }

  // Check if the correct Auth Header is provided
  const authHeader = req.headers.authorization
  console.log("authHeader: ", authHeader)
  // A valid Auth header for JWT should look like:
    // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzAwMDY5MDQyfQ.4IigdSKMJAAYGPQi_mhZEFsyRqSoF1oiJH5qe5GwMLQ"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid authentication header' })
  }

  // Get the JWT from the request headers
    // split the header at the space and get the second element
    // This removes "Bearer" from the front
  const token = authHeader.split(' ')[1]  

  // If there's no token, return an error
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }

  try {
    // decode and verify the JWT using the SECRET_KEY that originally signed the token
      // if the token is not valid it will error and go to catch block
    const decoded = jwt.verify(token, process.env.SECRET_KEY)

    //get the user data from the database using the user id provided by the JWT
      // findById is from '../routes/users/service'
    const user = await findById(decoded.id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid token: User does not exist' })
    }

    // Add the user object to the request object
    req.user = user

    next()
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}