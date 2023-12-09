const { Router } = require('express');
const { authenticate } = require('../../middleware/auth');
const {showAllTasks, createTask, getTaskById, updateTaskById, deleteTaskById,} = require('./controller');

const router = new Router();

// retrieves all tasks
router.get('/', authenticate, showAllTasks);

// create a new task
router.post('/', authenticate, createTask);

// retrieves a task by its ID
router.get('/:id', authenticate, getTaskById);

// updates a task by its ID
router.put('/:id', authenticate, updateTaskById);

// deletes a task by its ID
router.delete('/:id', authenticate, deleteTaskById);

module.exports = router;