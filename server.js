const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const app = express();
const notifyUsers = require("./helpers/notifications");
const runCronJob = require("./helpers/cronJob");

connectDB();

// live notifications and emails
notifyUsers()

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

// Schedule tasks to be run on the server.
runCronJob()

app.listen(PORT, () => console.log("Server is running on port " + PORT));
