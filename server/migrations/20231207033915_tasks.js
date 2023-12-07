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
        table.time('timeStart').unique();
        table.time('timeEnd').unique();
        table.enu('priorityLevel', ['Urgent', 'Important', 'Optional'])
        table.text('notes') 
        table.integer('userId').notNullable().onDelete('CASCADE')
        table.timestamps.notNullable()
      })
    }
    
    exports.down = function(knex) {
      return knex.schema.dropTable('tasks');
    }
