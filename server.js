const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const Pusher = require("pusher");
const Notification = require("./models/Notification");

connectDB();

const pusher = new Pusher({
    appId: "1194970",
    key: "7dc61c61506f7d658f25",
    secret: "be95880ca8e13c4bebf8",
    cluster: "ap2",
    useTLS: true
  });
const db = mongoose.connection;
const channel = "notifications";
db.once("open", () => {

  const notificationsCollection = db.collection("notifications");
  const changeStream = notificationsCollection.watch();
  changeStream.on("change", async (change) => {

    if (change.operationType === "insert") {
      const notification = change.fullDocument;
      const nss = await Notification.findOne({_id: notification._id})
        .populate({ path: "sender", select: "_id, name" })
        .populate({ path: "post", select: "_id, text" });
        console.log()
      pusher.trigger("notifications", "inserted", nss);
    }
  });
});

app.use(express.json({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});
// define routes
app.use("/api/users", require("./routes/apis/users"));
app.use("/api/auth", require("./routes/apis/auth"));
app.use("/uploads", express.static("uploads"));
app.use("/api/posts", require("./routes/apis/posts"));

if (process.env.NODE_ENV === "production") {
  // set static
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server is running on port " + PORT));
