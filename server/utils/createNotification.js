const Notification = require("../models/notification");

const createNotification = async (title, message, type, link = "") => {
  try {
    console.log("Creating Notification...");

    const notification = await Notification.create({
      title,
      message,
      type,
      link,
    });

    console.log("Notification Saved:", notification);
  } catch (error) {
    console.log("Notification Error:");
    console.log(error);
  }
};

module.exports = createNotification;