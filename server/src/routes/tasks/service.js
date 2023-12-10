const knex = require('../../knex.js');

exports.findAllTasks = async () => {
  try {
    const tasks = await knex('tasks').select('*');
    return tasks;
  } catch (error) {
    throw error;
  }
};

exports.findTaskById = async (taskId) => {
  try {
    const task = await knex('tasks').where('id', taskId).first('*');
    return task;
  } catch (error) {
    throw error;
  }
};

exports.createTask = async (newTask) => {
  try {
    const createdTask = await knex('tasks').insert(newTask).returning('*');
    return createdTask[0];
  } catch (error) {
    throw error;
  }
};

exports.updateTaskById = async (taskId, updatedTaskData) => {
  try {
    const updatedTask = await knex('tasks').where('id', taskId).update(updatedTaskData).returning('*');
    return updatedTask[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteTaskById = async (taskId) => {
  try {
    const deletedTask = await knex('tasks').where('id', taskId).delete().returning('id');
    return deletedTask[0];
  } catch (error) {
    throw error;
  }
};
