const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const mongoose = require("mongoose");
const app = express();
const Pusher = require("pusher");
const Notification = require("./models/Notification");
const Post = require("./models/Post");
const cron = require('node-cron');
const request = require("request");
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('031719ac992040b68a5a32ebd765b172');

connectDB();

const pusher = new Pusher({
  appId: "1194970",
  key: "7dc61c61506f7d658f25",
  secret: "be95880ca8e13c4bebf8",
  cluster: "ap2",
  useTLS: true,
});
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

  // const postsCollection = db.collection("posts");
  // const postsCollectionchangeStream = postsCollection.watch();
  // postsCollectionchangeStream.on("change", async (change) => {
  //   if (change.operationType === "insert") {
  //     const post = change.fullDocument;
  //     const nss = await Post.findOne({ _id: post._id })
  //       .populate("owner", "name")
  //       .populate({ path: "user", select: "name avatar imageData" })
  //       .populate({ path: "comments.user", select: "name avatar imageData" });
  //     pusher.trigger("posts", "inserted", nss);
  //   } else if (change.operationType === "update") {
  //     const post = change.fullDocument;
  //     const nss = await Post.findOne({ _id: post._id })
  //       .populate("owner", "name")
  //       .populate({ path: "user", select: "name avatar imageData" })
  //       .populate({ path: "comments.user", select: "name avatar imageData" });
  //     pusher.trigger("posts", "updated", nss);
  //   } else if (change.operationType === "update") {
  //     const post = change.fullDocument;
  //     const nss = await Post.findOne({ _id: post._id })
  //       .populate("owner", "name")
  //       .populate({ path: "user", select: "name avatar imageData" })
  //       .populate({ path: "comments.user", select: "name avatar imageData" });
  //     pusher.trigger("posts", "deleted", nss);
  //   }
  // });
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Schedule tasks to be run on the server.
cron.schedule('0 0 0 * * *', async function() {
  console.log('running a every 12am');

  let newpost = {
    user: '608438c33383641df099002a',
    text: "",
    name: "StrictlySocial Official",
    avatar: "https://res.cloudinary.com/strictlysocial/image/upload/c_fill,g_faces,h_300,w_300/onmrvacdyb3dntkyvzy0",
    likes: [],
    comments: [],
    imageName: "none",
    imageData: "",
    linkData: {},
  }

  // health/covid
  const health = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'health',
    language: 'en',
    country: 'in'
  })

  if(health && health.articles.length > 0){
    let {title, description, url, urlToImage} = health.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #health #covid-19 #covid19";;
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const sports = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'sports',
    language: 'en',
    country: 'in'
  })

  if(sports && sports.articles.length > 0){
    let {title, description, url, urlToImage} = sports.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #sports";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const entertainment = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'entertainment',
    language: 'en',
    country: 'in'
  })

  if(entertainment && entertainment.articles.length > 0){
    let {title, description, url, urlToImage} = entertainment.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #entertainment";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const general = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'general',
    language: 'en',
    country: 'in'
  })

  if(general && general.articles.length > 0){
    let {title, description, url, urlToImage} = general.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #news";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const science = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'science',
    language: 'en',
    country: 'in'
  })

  if(science && science.articles.length > 0){
    let {title, description, url, urlToImage} = science.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #science";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const technology = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'technology',
    language: 'en',
    country: 'in'
  })

  if(technology && technology.articles.length > 0){
    let {title, description, url, urlToImage} = technology.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #technology";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }

  sleep(5000);
  const business = await newsapi.v2.topHeadlines({
    // sources:'google-news-in',
    category: 'business',
    language: 'en',
    country: 'in'
  })

  if(business && business.articles.length > 0){
    let {title, description, url, urlToImage} = business.articles[0];
    let post = new Post({...newpost})
    post.text = title + " #business";
    post.linkData = {title, url, description, ogImage: urlToImage}
    await post.save();
  }
  sleep(5000);
  console.log("Done")
});

app.listen(PORT, () => console.log("Server is running on port " + PORT));
