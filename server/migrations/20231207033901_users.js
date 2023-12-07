/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments('id');
      table.string('firstName').notNullable();
      table.string('lastName').notNullable();
      table.string('email').unique().notNullable();
      table.string('password').unique().notNullable();
      table.enum('role', ['admin', 'user']).defaultTo('user').notNullable()
      table.timestamps(['true'], ['true'], ['true'])

    })
  }
  
  exports.down = function(knex) {
    return knex.schema.dropTable('users');
  }