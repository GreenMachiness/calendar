/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notification', function(table) {
        table.increments('id');
        table.integer('duration').notNullable();
        table.enu('unit', ['days', 'weeks', 'months', "years"]).notNullable();
        table.integer('taskId').references('id').inTable('tasks').notNullable().onDelete('CASCADE')
        table.timestamps(['true'], ['true'], ['true'])

      })
    }
    
    exports.down = function(knex) {
      return knex.schema.dropTable('notification');
    }