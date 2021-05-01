const Post = require("../models/Post");
const cron = require('node-cron');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('031719ac992040b68a5a32ebd765b172');
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const runCronJob = async () => {
  cron.schedule("0 0 0 * * *", async function () {
    console.log("running a every 12am");

    let newpost = {
      user: "608438c33383641df099002a",
      text: "",
      name: "StrictlySocial Official",
      avatar:
        "https://res.cloudinary.com/strictlysocial/image/upload/c_fill,g_faces,h_300,w_300/onmrvacdyb3dntkyvzy0",
      likes: [],
      comments: [],
      imageName: "none",
      imageData: "",
      linkData: {},
    };

    // health/covid
    const health = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "health",
      language: "en",
      country: "in",
    });

    if (health && health.articles.length > 0) {
      let { title, description, url, urlToImage } = health.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #health #covid-19 #covid19";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const sports = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "sports",
      language: "en",
      country: "in",
    });

    if (sports && sports.articles.length > 0) {
      let { title, description, url, urlToImage } = sports.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #sports";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const entertainment = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "entertainment",
      language: "en",
      country: "in",
    });

    if (entertainment && entertainment.articles.length > 0) {
      let { title, description, url, urlToImage } = entertainment.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #entertainment";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const general = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "general",
      language: "en",
      country: "in",
    });

    if (general && general.articles.length > 0) {
      let { title, description, url, urlToImage } = general.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #news";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const science = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "science",
      language: "en",
      country: "in",
    });

    if (science && science.articles.length > 0) {
      let { title, description, url, urlToImage } = science.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #science";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const technology = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "technology",
      language: "en",
      country: "in",
    });

    if (technology && technology.articles.length > 0) {
      let { title, description, url, urlToImage } = technology.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #technology";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }

    sleep(5000);
    const business = await newsapi.v2.topHeadlines({
      // sources:'google-news-in',
      category: "business",
      language: "en",
      country: "in",
    });

    if (business && business.articles.length > 0) {
      let { title, description, url, urlToImage } = business.articles[0];
      let post = new Post({ ...newpost });
      post.text = title + " #business";
      post.linkData = { title, url, description, ogImage: urlToImage };
      await post.save();
    }
    sleep(5000);
    console.log("Done");
  });
};

module.exports = runCronJob;
