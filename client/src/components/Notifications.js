import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import { getUser } from "../utils/utils";
import BasicInfo from "./BasicInfo";
import "./Home.css";
import SideBar from "./SideBar";
import ReactTimeAgo from "react-time-ago";

export default function Notifications({ channel, setNts }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  const userInfo = getUser();
  const [notifications, setNotifications] = useState([]);
  const { key } = useLocation();
  
  const addNotification = (newNotification) => {
      console.log(newNotification, currentUser)
      if(newNotification.receiver === currentUser._id){
        setNotifications(pre => [newNotification, ...pre]);
      }
};
  useEffect(() => {
    setNts([])
    if (userInfo.token) {
      setAuthToken(userInfo.token);
    }
    async function getPopular() {
      try {
        const res = await axios.get("/api/users/notifications");
        setNotifications(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getPopular();
    channel.bind('inserted', function(data) {
        addNotification(data)
    });

  }, [key, getUser]);
  return (
    <React.Fragment>
      <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
        <div className="row">
          <div className="col-md-3">
            <BasicInfo
              setUserInfo={() => console.log("Do nothing")}
              userInfo={currentUser}
              setCurrentUser={setCurrentUser}
              currentUser={currentUser}
            />
          </div>
          <div className="col-md-6 border-left border-right ">
            <h5>Notifications</h5>
            <ul className="list-group custom-nav m-0 border-top  border-bottom p-0 list-group-flush">
              {notifications &&
                notifications.length > 0 &&
                notifications.map((notification) => (
                  <span>
                    {notification.action === "like" && notification.sender._id !==currentUser._id && notification.post ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-gittip"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        Liked your post{" "}
                        <Link
                          className="d-inline"
                          to={"/post/" + notification.post._id}
                        >
                          {!notification.post.text
                            ? "Image"
                            : notification.post.text.substring(0, 50)}
                        </Link>{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : notification.action === "share" && notification.sender._id !==currentUser._id && notification.post ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-mail-forward"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        Shared your post{" "}
                        <Link
                          className="d-inline"
                          to={"/post/" + notification.post._id}
                        >
                          {notification.post.text.substring(0, 50)}
                        </Link>{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : notification.action === "comment" && notification.sender._id !==currentUser._id &&
                      notification.post ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-comment"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        Commented on your post{" "}
                        <Link
                          className="d-inline"
                          to={"/post/" + notification.post._id}
                        >
                          {!notification.post.text
                            ? "Image"
                            : notification.post.text.substring(0, 50)}
                        </Link>{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : notification.action === "follow" && notification.sender._id !==currentUser._id ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-user-plus"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        started following you{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : notification.action === "tag" && notification.sender._id !==currentUser._id && notification.post ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-user-plus"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        tagged you in the post{" "}
                        <Link
                          className="d-inline"
                          to={"/post/" + notification.post._id}
                        >
                          {!notification.post.text
                            ? "Image"
                            : notification.post.text.substring(0, 50)}
                        </Link>{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : notification.action === "mention" && notification.sender._id !==currentUser._id &&
                      notification.post ? (
                      <li
                        key={notification._id}
                        className="list-group-item my-0 py-1 px-1"
                      >
                        <i class="fa fa-user-plus"></i>{" "}
                        <Link
                          className="d-inline"
                          to={"/profile/" + notification.sender._id}
                        >
                          {notification.sender.name}
                        </Link>{" "}
                        mentioned in the comments of the post{" "}
                        <Link
                          className="d-inline"
                          to={"/post/" + notification.post._id}
                        >
                          {!notification.post.text
                            ? "Image"
                            : notification.post.text.substring(0, 50)}
                        </Link>{" "}
                        <div className="date text-muted">
                          <i className="fa fa-clock-o"></i>{" "}
                          <ReactTimeAgo date={notification.date} />
                        </div>
                      </li>
                    ) : (
                      ""
                    )}
                  </span>
                ))}
            </ul>

            {notifications && !notifications.length && (
              <h6>No notifications found</h6>
            )}
          </div>
          <div className="col-md-3 ">
            <SideBar />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
