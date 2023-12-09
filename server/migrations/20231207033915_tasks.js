/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tasks', function(table) {
        table.increments('id');
        table.string('taskTitle').notNullable();
        table.date('dateStart').notNullable();
        table.date('dateEnd').notNullable();
        table.time('timeStart')
        table.time('timeEnd')
        table.enu('priorityLevel', ['urgent', 'important', 'optional'])
        table.text('notes') 
        table.integer('userId').references('id').inTable('users').notNullable().onDelete('CASCADE')
        table.timestamps(['true'], ['true'], ['true'])
      })
    }
    
    exports.down = function(knex) {
      return knex.schema.dropTable('tasks');
    }
