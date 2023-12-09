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

exports.createTask = async (taskData, userId) => {
    try {
      // add userId to task data before inserting into the database
      const taskWithUser = { ...taskData, userId };
      const createdTask = await knex('tasks').insert(taskWithUser).returning('*');
      return createdTask[0];
    } catch (error) {
      throw error;
    }
  };
  
  exports.updateTaskById = async (taskId, updatedTaskData, userId) => {
    try {
        //make it so that it would query where the id is equal to taskID, and userID
      const updatedTask = await knex('tasks').where({ id: taskId, userId }).update(updatedTaskData).returning('*');
      return updatedTask[0];
    } catch (error) {
      throw error;
    }
  };
  
  exports.deleteTaskById = async (taskId, userId) => {
    try {
      // when deleting tasks, check for id is equal to taskId, and user ID
      const deletedTask = await knex('tasks').where({ id: taskId, userId }).delete().returning('id');
      return deletedTask[0];
    } catch (error) {
      throw error;
    }
  };
