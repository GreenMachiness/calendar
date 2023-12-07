/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('notification', function(table) {
        table.increments('id');
        table.integer('value').notNullable();
        table.enu('unit', ['days', 'weeks', 'months', "years"]).notNullable();
        table.date('expire').notNullable();
        table.integer('taskId').references('id').inTable('tasks').notNullable().onDelete('CASCADE')
        table.timestamps.notNullable()
      })
    }
    
    exports.down = function(knex) {
      return knex.schema.dropTable('notification');
    }
