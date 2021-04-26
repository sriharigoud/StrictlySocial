import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import BasicInfo from "./BasicInfo";
import Post from "./Post";
import CreatePost from "./CreatePost";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import { Link } from "react-router-dom";

export default function Home() {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState("");

  const toggleLike = async (post) => {
    try {
      const res = await axios.put(`/api/posts/likes/${post._id}`);
      setPosts((prevPosts) => {
        return prevPosts.map((a) =>
          a._id === post._id ? { ...a, likes: res.data } : { ...a }
        );
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  const sharePost = async (post) => {
    try {
      const res = await axios.get(`/api/posts/share/${post._id}`);
      setPosts((prevPosts) => {
        return [res.data.newpost, ...prevPosts];
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
    async function fetchPosts() {
      let response = await axios("/api/posts");
      setPosts(response.data);
    }
    try {
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, [getUser]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3 ">
          <BasicInfo
            setUserInfo={() => console.log("Do nothing")}
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
         </div>
        <div className="col-md-6 border-left border-right">
          <CreatePost setPosts={setPosts} />
          {posts &&
            posts.map((post) => (
              <Post
                key={post._id}
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
              />
            ))}
          {!posts.length && (
            <h6 className="my-3">Search & Follow someone to see Posts</h6>
          )}
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
