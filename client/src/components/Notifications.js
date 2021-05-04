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
import { setAll } from "../redux/Notifications/Notifications.actions";
import { connect } from "react-redux";
import ProfileLink from "./ProfileLink";

function Notifications({ setNts, notifications, setAll }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  const userInfo = getUser();
  const { key } = useLocation();
  
  useEffect(() => {
    setNts([])
    if (userInfo.token) {
      setAuthToken(userInfo.token);
    }
    async function getPopular() {
      try {
        const res = await axios.get("/api/users/notifications");
        setAll(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getPopular();
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
          <div className="col-md-6 border-left border-right mb-2">
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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
                        <ProfileLink id={notification.sender.email.split("@")[0]} name={notification.sender.name} />{" "}
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

const mapStateToProps = state => {
  return {
    notifications: state.notifications.notifications,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAll: (payload) => dispatch(setAll(payload)),
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
