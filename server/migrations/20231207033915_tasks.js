/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
        table.increments('id');
        table.string('title').notNullable();
        table.date('start').notNullable();
        table.date('end').notNullable();
        table.time('timeStart')
        table.time('timeEnd')
        table.enu('priorityLevel', ['urgent', 'important', 'optional']).defaultTo('optional')
        table.text('notes') 
        table.integer('userId').references('id').inTable('users')
        table.timestamps(['true'], ['true'], ['true'])
      })
    }
    
    exports.down = function(knex) {
      return knex.schema.dropTable('tasks');
    }
