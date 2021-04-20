import axios from "axios";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import { getUser } from "../utils/utils";
import UserBox from "./UserBox";

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
  }, [key,getUser]);
  return (
    <React.Fragment>
      <div className="card mb-2 gedf-card">
        <div className="card-body px-2">
          <h5 className="card-title mb-2">Most followed people</h5>
          <p className="card-text border-top">
            {users &&
              users.map((user, d) => (
                <div className="d-flex border-bottom my-2 py-2 flex-row comment-row">
                  <div className="p-1">
                    <span className="round">
                      <img
                        className="rounded-circle"
                        src={user.avatar}
                        alt="user"
                        width="40"
                      />
                    </span>
                  </div>
                  <div className="comment-text w-100">
                    <h5 className="mb-0">
                      <Link to={`/profile/${user._id}`}>{user.name}</Link>
                    </h5>
                    <p className="my-0 mw-100 text-truncate">{user.email}</p>
                  </div>
                </div>
              ))}
          </p>
        </div>
      </div>
      <div className="card mb-2 gedf-card">
        <div className="card-body px-2">
          <h5 className="card-title mb-2">Most liked posts</h5>
          <p className="card-text">
            <ul className="list-group m-0 border-top  border-bottom p-0 list-group-flush">
              {posts &&
                posts.map((post, i) => (
                  <li key={i} className="list-group-item my-0 py-1 px-1">
                    <Link to={`/post/${post._id}`}>
                      {post.text.substr(0, 50)}
                    </Link>
                  </li>
                ))}
            </ul>
          </p>
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