import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import BasicInfo from "./BasicInfo";
import Post from "./Post";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import { useLocation } from "react-router";
import { Link } from "react-router-dom";

export default function PostContainer() {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const { pathname, key } = useLocation();

  const toggleLike = async (post) => {
    try {
      const res = await axios.put(`/api/posts/likes/${post._id}`);
      setPost({...post, likes: res.data});
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
      setPost({...post, comments: res.data});
      setCommentText("")
    } catch (error) {
      console.log(error.message);
    }
  };
  const sharePost = async (post) => {
    try {
        const res = await axios.get(`/api/posts/share/${post._id}`);
    } catch (error) {
      console.log(error.message);
    }
  };
  const deletePost = async (post) => {
    try {
      const confirmV = window.confirm("Delete Post?");
      if (confirmV) {
        const res = await axios.delete(`/api/posts/${post._id}`);
        setPost(null);
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
        setPost({...post, comments: res.data});
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    async function fetchPosts() {
      let response = await axios(
        "/api/posts/" + pathname.replace("/post/", "")
      );
      setPost(response.data.post);
    }
    try {
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, [key, getUser]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3">
          <BasicInfo
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        </div>
        <div className="col-md-6 border-left border-rightp">
          {post && <Post
            post={post}
            userId={currentUser._id}
            setCommentText={setCommentText}
            submitComment={submitComment}
            toggleLike={toggleLike}
            deletePost={deletePost}
            deleteComment={deleteComment}
            sharePost={sharePost}
            currentUser={currentUser}
            commentText={commentText}
          />}
          {post === null && (<React.Fragment><h3>No Post Found</h3> <Link to="/home">Click to go back to home</Link></React.Fragment>)}
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
