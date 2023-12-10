const tasks = require(`./data/tasks.json`)
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('tasks').del()
  await knex('tasks').insert(tasks);
  await knex.raw( `ALTER SEQUENCE users_id_seq RESTART WITH ${tasks.length + 1}`)

};
