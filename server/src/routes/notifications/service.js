const knex = require('../../knex.js');

exports.findAllNotifications = async () => {
  try {
    const notifications = await knex('notifications').select('*');
    return notifications;
  } catch (error) {
    throw error;
  }
};

exports.findNotificationById = async (notificationId) => {
  try {
    const notification = await knex('notifications').where('id', notificationId).first('*');
    return notification;
  } catch (error) {
    throw error;
  }
};

exports.createNotification = async (newNotification) => {
  try {
    const createdNotification = await knex('notifications').insert(newNotification).returning('*');
    return createdNotification[0];
  } catch (error) {
    throw error;
  }
};

exports.updateNotificationById = async (notificationId, updatedNotificationData) => {
  try {
    const updatedNotification = await knex('notifications').where('id', notificationId).update(updatedNotificationData).returning('*');
    return updatedNotification[0];
  } catch (error) {
    throw error;
  }
};

exports.deleteNotificationById = async (notificationId) => {
  try {
    const deletedNotification = await knex('notifications').where('id', notificationId).delete().returning('id');
    return deletedNotification[0];
  } catch (error) {
    throw error;
  }
};
