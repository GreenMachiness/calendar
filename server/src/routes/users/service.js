const knex = require('../../knex.js')
const bcrypt = require('bcrypt')

exports.findAll = async ({page = 0, limit}) => {
  const results = await knex('users')
    .select("*")
    .modify((queryBuilder) => {
      // conditionally add pagination only if a limit is set
      if (limit) {
        const offset = (page - 1) * limit // calculate the starting point
        queryBuilder.offset(offset).limit(limit) 
      }
    })

  return results
}

exports.findById = async (id) => {

  const user = await knex('users')
    .where('id', id)
    .first('*')

  return user
}

exports.findByUsername = async (username) => {
  // Find the first user in the database with the username
const user = await knex('users')
  .where('username', username)
  .first('*')

return user
}

exports.insert = async (data) => {
  // create user in database

  // destructure username and password
  const {username, password} = data

  // Hash the password with 10 rounds of salt
  const hash = await bcrypt.hash(password, 10)

  // delete plaintext password
  delete data.password

  // Insert the user into the database and return
  const result = await knex('users').insert({
    ...data,
    username: username,
    password: hash //store the hash. DO NOT store a plaintext password!
  }).returning(['id', 'username', 'role']) // return the data you need excluding the password
  
  return result
}

exports.modifyById = async (id, data) => {
  // update the user with matching id in db and return the user
  const result = await knex('users')
    .where('id', '=', id)
    .update(data)
    .returning('*') // returning is used to return data after an update

  return result[0]
}

exports.deleteById = async (id) => {
  // delete the user with matching id in db and return the user id
  const result = await knex('users')
    .where('id', '=', id)
    .delete()
    .returning('id') // returning is used to return data after an update

  return result[0].id
}