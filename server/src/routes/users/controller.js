require('dotenv').config()

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { findAll, findById, findByUsername, insert, deleteById } = require('./service')

exports.showAll = async (req, res) => {
  try {

    const {
      user,
      query
    } = req

    // Define the roles allowed to access
    if (!user || user.role !== 'admin') { // Only allow admins to access the user list
      return res.status(403).json({ message: 'You do not have permission to access this resource' })
    }

    // get allUsers from the database
    const allUsers = await findAll(query)
      .then((users) => {
        // modify the resulting array to remove the passwords
        return users.map((user) => {
          // remove the password from the user object
          delete user.password
          // add the user to the new array
          return user
        })
      })

    // return a response with allUsers
    return res.status(200).json({message: 'users found!', data: allUsers})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

exports.showById = async (req, res) => {
  try {
    // get the id from the request
    const { 
      user,
      id
    } = req.params
    
    console.log('req.params.id: ', id)
    
    // Only allow admins and account owners to access the user data
    if (!user || (user.id != req.params.id && user.role !== 'admin')) {
      return res.status(403).json({ message: 'You do not have permission to access this resource' })
    }

    // get user using id from the database
    const foundUser = await findById(id)
    if (!foundUser) {
      return res.status(404).json({message: 'user not found'})
    }

    // remove the password
    delete foundUser.password

    // return a response with the user at the specific id
    return res.status(200).json({message: 'user found!', data: foundUser})
  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

exports.updateById = async (req, res) => {

  try {
    
    // get the id from the request
    const {id} = req.params
    console.log('id:', id)

    // get the data to update the user from the request
    const body = req.body
    console.log('body: ', body)

    // get user using id from the database
    const user = await findById(id)

    // merge the updates
    const dataToUpdate = Object.assign(user, body)

    // update the user in the database and return the updated User
    const updatedUser = await modifyById(id, dataToUpdate)

    // remove the password
    delete updatedUser.password

    // return response with the updated user
    return res.status(200).json({message: 'updated user successfully!', data: updatedUser})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

exports.destroyById = async (req, res) => {

  try {
    
    // get the id from the request
    const {id} = req.params
    console.log(id)

    // delete the user from the database with the id
    const deletedUserId = await deleteById(id)
    // return response saying user with id is deleted
    return res.status(200).json({message: `user with id: ${deletedUserId} deleted`})

  } catch (error) {
    console.log(error)
    return res.status(500).json({message: 'Internal Server Error'})
  }
}

exports.register = async (req, res) => {
  try {

    const userData = req.body

    const user = await insert(userData)
    
    // Create a JWT and send it back to the client
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY)

    // remove the password
    delete user.password

    return res.status(201).json({ message: 'user created successfully!', data: user, token: token })

  } catch (error) {
    console.log(error)

    if(error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: "Account already exists" })
    }

    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.login = async (req, res) => {
  try {
    // get credentials from header
    // A valid Auth header for username + password should look like:
      // "Basic dXNlcm5hbWU6cGFzc3dvcmQ="
    const authHeader = req.headers.authorization
    // check if auth header is missing 
    // or if auth header does not Basic type (username + password)
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ message: 'Invalid authorization header' })
    }
    // remove "Basic" from the start of the header
    // decode the base64 string to text
      // "dXNlcm5hbWU6cGFzc3dvcmQ=" turns into "username:password"
    // split the string into an array at the ":"
    const credentials = Buffer.from(authHeader.slice(6), 'base64').toString().split(':')

    // destructure credentials array
    const [username, password] = credentials 

    // get the user with the provided username
    const user = await findByUsername(username)

    // bcrypt.compare takes the plain-text password and re-hashes 
      // then compares to the hash in the database
    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      // If the user isn't found or the password is incorrect, return an error
      return res.status(401).json({ message: 'Invalid username or password' })
    }

    // Create a JWT, with the payload {id: user.id}, 
      // and sign the token with the SECRET_KEY from .env
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY)
    
    // send the token back to the client
    return res.status(200).json({message: 'login successful!', token: token })

  } catch (error) {
    console.log(error)
    return res.status(500).send('Internal Server Error')
  }
}