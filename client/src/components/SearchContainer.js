import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import { useLocation } from "react-router";
import { Tabs, Tab } from "react-bootstrap";
import UserBox from "./UserBox";
import { Link } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import Post from "./Post";

export default function SearchContainer({searchKey, showPeople}) {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [commentText, setCommentText] = useState("");
  const { key, pathname } = useLocation();
  const toggleLike = async (post) => {
    try {
      const res = await axios.put(`/api/posts/likes/${post._id}`);
      setPosts((prevPosts) => {
        return prevPosts.map((a) =>
          a.id === post.id ? { ...a, likes: res.data } : { ...a }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const submitComment = async (post) => {
    try {
      const res = await axios.post(
        `/api/posts/comments/${post._id}`,
        JSON.stringify({ text: commentText }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setPosts((prevPosts) => {
        return prevPosts.map((a) =>
          a._id === post._id ? { ...a, comments: res.data } : { ...a }
        );
      });
      setCommentText("")
    } catch (error) {
      console.log(error.message);
    }
  };
  const deletePost = async (post) => {
    try {
      const confirmV = window.confirm("Delete Post?");
      if (confirmV) {
        const res = await axios.delete(`/api/posts/${post._id}`);
        setPosts((prevPosts) => {
          return prevPosts.filter((a) => a._id !== post._id);
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const deleteComment = async ({ post, comment }) => {
    try {
      const confirmV = window.confirm("Delete Comment?");
      if (confirmV) {
        const res = await axios.delete(
          `/api/posts/comments/${post._id}/${comment._id}`
        );
        setPosts((prevPosts) => {
          return prevPosts.map((a) =>
            a._id === post._id ? { ...a, comments: res.data } : { ...a }
          );
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    async function getPopular() {
      try {
        const res = await axios.get("/api/posts/search/"+searchKey);
        setPosts(res.data);
      } catch (error) {
        console.log(error.message);
      }
      try {
        const res = await axios.get("/api/users/search/"+searchKey);
        setUsers(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getPopular();
  }, [key, getUser]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3 d-none d-md-block">
        <BasicInfo
            setUserInfo={() => console.log("Do nothing")} userInfo={currentUser} setCurrentUser={setCurrentUser} currentUser={currentUser}
          />
        </div>
        <div className="col-md-6 border-left border-right ">
          <h4>Search Results: </h4>
          <Tabs
            defaultActiveKey="posts"
            transition={false}
            id="noanim-tab-example"
          >
              <Tab eventKey="posts" title="Posts" className="pt-1">
              {posts &&
                posts.map((post, i) => (
                  <Post
                    key={post._id}
                    post={post}
                    userId={currentUser._id}
                    setCommentText={setCommentText}
                    submitComment={submitComment}
                    toggleLike={toggleLike}
                    deletePost={deletePost}
                    deleteComment={deleteComment}
                    currentUser={currentUser}
                    commentText={commentText}
                  />
                ))}
                {!posts.length && <h6>No Posts Found</h6>}
            </Tab>
          
            {showPeople && <Tab eventKey="people" title="People" className="pt-1">
            {users && users.map((user,d) => (<UserBox
                    key={d}
                    setCurrentUser={setCurrentUser}
                    currentUser={currentUser}
                    user={user}
                  />))}
                  {!users.length && <h6>No People Found</h6>}
            </Tab> }
            </Tabs>
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
