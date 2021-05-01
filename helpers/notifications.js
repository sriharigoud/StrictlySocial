const mongoose = require("mongoose");
const Pusher = require("pusher");
const Notification = require("../models/Notification");
const pusher = new Pusher({
  appId: "1194970",
  key: "7dc61c61506f7d658f25",
  secret: "be95880ca8e13c4bebf8",
  cluster: "ap2",
  useTLS: true,
});

const notifyUsers = async () => {
  const db = mongoose.connection;
  db.once("open", () => {
    const notificationsCollection = db.collection("notifications");
    const changeStream = notificationsCollection.watch();
    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        const notification = change.fullDocument;
        const nss = await Notification.findOne({ _id: notification._id })
          .populate({ path: "sender", select: "_id, name" })
          .populate({ path: "post", select: "_id, text" });
        // console.log(nss);
        pusher.trigger("notifications", "inserted", nss);
      }
    });
  });
};
module.exports = notifyUsers;
