const { findAllNotifications, findNotificationById, createNotification, updateNotificationById, deleteNotificationById } = require('./service');

// Show all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const allNotifications = await findAllNotifications();
    return res.status(200).json({ message: 'Notifications found!', data: allNotifications });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get notification by ID
exports.getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await findNotificationById(id);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification found!', data: notification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Create a notification
exports.createNotification = async (req, res) => {
  try {
    const newNotification = req.body;
    const createdNotification = await createNotification(newNotification);

    return res.status(201).json({ message: 'Notification created successfully!', data: createdNotification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a notification by ID
exports.updateNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedNotificationData = req.body;

    const updatedNotification = await updateNotificationById(id, updatedNotificationData);
    if (!updatedNotification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: 'Notification updated successfully!', data: updatedNotification });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a notification by ID
exports.deleteNotificationById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNotificationId = await deleteNotificationById(id);
    if (!deletedNotificationId) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    return res.status(200).json({ message: `Notification with ID ${deletedNotificationId} deleted successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
