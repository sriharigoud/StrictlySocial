import React, { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Search from "./components/Search";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Navigation from "./components/Navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
import "font-awesome/css/font-awesome.min.css";
import Profile from "./components/Profile";
import PostContainer from "./components/PostContainer";
import ResetPassword from "./components/ResetPassword";
import { createBrowserHistory } from "history";
import axios from "axios";
import { doLogout, getUser } from "./utils/utils";
import Covid19 from "./components/explore/Covid19";
import Entertainment from "./components/explore/Entertainment";
import Sports from "./components/explore/Sports";
import News from "./components/explore/News";
import Notifications from "./components/Notifications";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
Pusher.logToConsole = true;

var pusher = new Pusher("7dc61c61506f7d658f25", {
  cluster: "ap2",
});

var channel = pusher.subscribe("notifications");
const history = createBrowserHistory();

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      console.log(history);
      doLogout();
      history.push("/login");
    }

    return Promise.reject(error);
  }
);
export default function App() {
  let [currentUser, setCurrentUser] = useState(getUser());
  useEffect(() => {
    channel.bind("inserted", function (data) {
      if (
        currentUser._id === data.receiver &&
        currentUser._id !== data.sender._id
      ) {
        if (data.action === "like") {
          NotificationManager.info(
            `${data.sender.name} liked your post ${
              data.post.text ? data.post.text.substring(0, 50) : "Image"
            }`
          );
        } else if (data.action === "comment") {
          NotificationManager.info(
            `${data.sender.name} commented on your post ${
              data.post.text ? data.post.text.substring(0, 50) : "Image"
            }`
          );
        } else if (data.action === "share") {
          NotificationManager.info(
            `${data.sender.name} shared your post ${
              data.post.text ? data.post.text.substring(0, 50) : "Image"
            }`
          );
        } else if (data.action === "tag") {
          NotificationManager.info(
            `${data.sender.name} tagged you in the post ${
              data.post.text ? data.post.text.substring(0, 50) : "Image"
            }`
          );
        } else if (data.action === "mention") {
          NotificationManager.info(
            `${data.sender.name} mentioned you in the post ${
              data.post.text ? data.post.text.substring(0, 50) : "Image"
            }`
          );
        } else if (data.action === "follow") {
          NotificationManager.info(
            `${data.sender.name} started following you`
          );
        }
      }
    });
  }, [getUser]);
  return (
    <div className="container-fluid h-auto app px-0 border-right border-left border-light">
      <Router history={history}>
        <Navigation />
        <Switch>
          <PublicRoute restricted={true} component={Login} path="/" exact />
          <PublicRoute
            restricted={true}
            component={Login}
            path="/login"
            exact
          />
          <PublicRoute
            restricted={true}
            component={Register}
            path="/register"
            exact
          />
          <PublicRoute
            restricted={false}
            component={ResetPassword}
            path="/reset/:id"
            exact
          />
          <PrivateRoute component={Home} path="/home" exact />
          <PrivateRoute component={News} path="/news" exact />
          <PrivateRoute
            channel={channel}
            component={Notifications}
            path="/notifications"
            exact
          />
          <PrivateRoute component={Sports} path="/sports" exact />
          <PrivateRoute component={Entertainment} path="/entertainment" exact />
          <PrivateRoute component={Covid19} path="/covid19" exact />
          <PrivateRoute component={Profile} path="/profile/:id" />
          <PrivateRoute component={Search} path="/search/:searchQuery" exact />
          <PrivateRoute component={PostContainer} path="/post/:id" exact />
        </Switch>
        <Footer />
      </Router>
      <NotificationContainer />
    </div>
  );
}
