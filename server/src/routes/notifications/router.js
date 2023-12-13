const { Router } = require('express');
const { authenticate } = require('../../middleware/auth');
const { createNotification, getAllNotifications, getNotificationById, updateNotificationById, deleteNotificationById } = require('./controller');

const router = new Router();

// Create a new notification
router.post('/', authenticate, createNotification);

// Get all notifications
router.get('/', authenticate, getAllNotifications);


// Retrieve a notification by its ID
router.get('/:id', authenticate, getNotificationById);

// Update a notification by its ID
router.put('/:id', authenticate, updateNotificationById);

// Delete a notification by its ID
router.delete('/:id', authenticate, deleteNotificationById);

module.exports = router;
