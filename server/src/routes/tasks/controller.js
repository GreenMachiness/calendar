const { findAllTasks, findTaskById, createTask, updateTaskById, deleteTaskById } = require('./service');

exports.showAllTasks = async (req, res) => {
  try {
    const allTasks = await findAllTasks();
    return res.status(200).json({ message: 'Tasks found!', data: allTasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await findTaskById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task found!', data: task });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const taskData = req.body;
    const userId = req.user.id; // Accessing the authenticated user's ID

    // Use userId to associate the task with this user
    const createdTask = await createTask(taskData, userId);

    return res.status(201).json({ message: 'Task created successfully!', data: createdTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTaskData = req.body;
    const userId = req.user.id; // Accessing the authenticated user's ID

    // Update the task, considering the user ID for authorization or association
    const updatedTask = await updateTaskById(id, updatedTaskData, userId);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: 'Task updated successfully!', data: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Accessing the authenticated user's ID

    // Delete the task, considering the user ID for authorization or association
    const deletedTaskId = await deleteTaskById(id, userId);
    if (!deletedTaskId) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.status(200).json({ message: `Task with ID ${deletedTaskId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
