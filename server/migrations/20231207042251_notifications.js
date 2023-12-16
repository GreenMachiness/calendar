/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("notifications", function (table) {
    table.increments("id");
    table.integer("duration").nullable;
    table
      .enu("unit", ["minutes", "hours", "days", "weeks"])
    table
      .integer("taskId")
      .references("id")
      .inTable("tasks")
      .notNullable()
      .onDelete("CASCADE");
    table.timestamps(["true"], ["true"], ["true"]);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("notifications");
};
