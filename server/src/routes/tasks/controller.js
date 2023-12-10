const { findAllTasks, findTaskById, createTask, updateTaskById, deleteTaskById } = require('./service');
//show all tasks
exports.showAllTasks = async (req, res) => {
  try {
 

    const allTasks = await findAllTasks();
    return res.status(200).json({ message: 'Tasks found!', data: allTasks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//getting task by ID
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
// create a task
exports.createTask = async (req, res) => {
  try {
    const newTask = req.body;
    const createdTask = await createTask(newTask);

    return res.status(201).json({ message: 'Task created successfully!', data: createdTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//updating a task
exports.updateTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTaskData = req.body;

    const updatedTask = await updateTaskById(id, updatedTaskData);
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: 'Task updated successfully!', data: updatedTask });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
//delete a task
exports.deleteTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTaskId = await deleteTaskById(id);
    if (!deletedTaskId) {
      return res.status(404).json({ message: 'Task not found' });
    }

    return res.status(200).json({ message: `Task with ID ${deletedTaskId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
