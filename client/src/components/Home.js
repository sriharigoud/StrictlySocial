import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import setAuthToken from "../utils/setAuthToken";
import BasicInfo from "./BasicInfo";
import Post from "./Post";
import CreatePost from "./CreatePost";
import SideBar from "./SideBar";

export default function Home() {
  const [userInfo, setUserInfo] = useState({});
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");
  const [commentText, setCommentText] = useState("");
  const toggleLike = async (post) => {
    try {
      const res = await axios.put(`api/posts/likes/${post._id}`);
      setPosts((prevPosts) => {
        return prevPosts.map((a) =>
          a._id === post._id ? { ...a, likes: res.data } : { ...a }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const submitPost = async () => {
    try {
      const res = await axios.post(`/api/posts`, JSON.stringify({ text }), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPosts((prevPosts) => {
        return [res.data.newpost, ...prevPosts];
      });
      setText("");
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
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      setAuthToken(localStorage.getItem("jwt"));
    }

    async function fetchMyAPI() {
      let response = await axios("/api/auth");
      setUserInfo(response.data);
    }

    async function fetchPosts() {
      let response = await axios("/api/posts");
      setPosts(response.data);
    }
    try {
      fetchMyAPI();
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3">
          <BasicInfo userInfo={userInfo} />
        </div>
        <div className="col-md-6 border-left border-right gedf-main gedf-main">
          <CreatePost submitPost={submitPost} setText={setText} />
          {posts &&
            posts.map((post) => (
              <Post
                key={post.id}
                post={post}
                userId={userInfo._id}
                setCommentText={setCommentText}
                submitComment={submitComment}
                toggleLike={toggleLike}
              />
            ))}
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
