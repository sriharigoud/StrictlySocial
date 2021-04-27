import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import { getUser } from "../utils/utils";
import "./Home.css";

export default function SideBar() {
  const userInfo = getUser();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const { key } = useLocation();
  useEffect(() => {
    if (userInfo.token) {
      setAuthToken(userInfo.token);
    }
    async function getPopular() {
      try {
        const res = await axios.get("/api/posts/popular");
        setPosts(res.data);
      } catch (error) {
        console.log(error.message);
      }
      try {
        const res = await axios.get("/api/users/popular");
        setUsers(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getPopular();
  }, [key, getUser]);
  return (
    <React.Fragment>
            <div className="card mb-2 gedf-card">
        <div className="card-body px-2">
          <h5 className="card-title mb-2">Who to follow</h5>
          <div className="card-text border-top">
            {users &&
              users.map((user, d) => (
                <div key={user._id} className="d-flex border-bottom my-1 py-1 flex-row comment-row">
                  <div className="p-1">
                    <span className="round">
                      <img
                        onError={(e) => e.target.src = user.avatar}
                        className="rounded-circle"
                        src={user.imageData ? user.imageData : user.avatar}
                        alt="user"
                        width="65"
                      />
                    </span>
                  </div>
                  <div className="comment-text w-100">
                    <h5 className="mb-0">
                      <Link to={`/profile/${user._id}`}>{user.name}</Link>
                    </h5>
                    <p
                      title={"@" + user.email.split("@")[0]}
                      className="my-0 w-75 text-truncate"
                    >
                      {"@" + user.email.split("@")[0]}
                    </p>
                    <p className="my-0 text-muted">
                      <small>
                        Following: {user.following && user.following.length} |
                        Followers: {user.followers && user.followers.length}
                      </small>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="card mb-2 gedf-card">
        <div className="card-body px-2">
          <h5 className="card-title mb-2">Posts to look at</h5>
          <div className="card-text">
            <ul className="list-group custom-nav m-0 border-top  border-bottom p-0 list-group-flush">
              {posts &&
                posts.map((post, i) => (
                  <li key={i} className="list-group-item my-0 py-1 px-1">
                    <Link to={`/post/${post._id}`}>
                      {post.text ? post.text.substr(0, 50) : "Image"}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="card mb-2 gedf-card">
        <div className="card-body">
          <h5 className="card-title">Sponsered</h5>
          <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="#" className="card-link">
            Card link
          </a>
          <a href="#" className="card-link">
            Another link
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}
