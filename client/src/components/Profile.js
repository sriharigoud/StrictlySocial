import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import BasicInfo from "./BasicInfo";
import Post from "./Post";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import CreatePost from "./CreatePost";
import { doLogin, getUser } from "../utils/utils";
import { Tabs, Tab } from "react-bootstrap";
import UserBox from "./UserBox";
import { SRLWrapper } from "simple-react-lightbox";

export default function Profile() {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [userInfo, setUserInfo] = useState({});
  const { pathname, key } = useLocation();
  const [commentText, setCommentText] = useState("");
  const [posts, setPosts] = useState([]);
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
    async function fetchPosts(userid) {
      if (currentUser.token) {
        setAuthToken(currentUser.token);
      }
      let response = await axios(
        "/api/posts/user/" + userid
      );
      setPosts(response.data);
    }
    async function getUserInfo() {
      if (currentUser.token) {
        setAuthToken(currentUser.token);
      }
      let response = await axios(
        "/api/users/" + pathname.replace("/profile/", "")
      );
      setUserInfo(response.data);
      fetchPosts(response.data._id);
    }
    try {
      getUserInfo();
    } catch (error) {
      console.log(error.message);
    }
  }, [key, getUser]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3">
          <BasicInfo
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        </div>
        <div className="col-md-6 border-left border-right ">
          {currentUser._id === pathname.replace("/profile/", "") && (
            <CreatePost setPosts={setPosts}  />
          )}
          <hr />
          <Tabs
            defaultActiveKey="feed"
            transition={false}
            id="noanim-tab-example"
          >
            <Tab eventKey="feed" title="Feed" className="pt-1">
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
              {posts && posts.length === 0 && <h6 className="m-2">No Posts found</h6>}
            </Tab>
            <Tab eventKey="following" title={`Following (${userInfo.following && userInfo.following.length ? userInfo.following.length : 0})`}>
              {userInfo.following &&
                userInfo.following.map((user, d) => (
                  <UserBox
                    key={d}
                    setCurrentUser={setCurrentUser}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    currentUser={currentUser}
                    user={user}
                  />
                ))}
              {userInfo.following && userInfo.following.length === 0 && (
                <h6 className="m-2">No Following found</h6>
              )}
            </Tab>
            <Tab eventKey="followers" title={`Followers (${userInfo.followers && userInfo.followers.length ? userInfo.followers.length : 0})`}>
              {userInfo.followers &&
                userInfo.followers.map((user, i) => (
                  <UserBox
                    key={i}
                    setCurrentUser={setCurrentUser}
                    userInfo={userInfo}
                    setUserInfo={setUserInfo}
                    currentUser={currentUser}
                    user={user}
                  />
                ))}
              {userInfo.followers && userInfo.followers.length === 0 && (
                <h6 className="m-2">No Followers found</h6>
              )}
            </Tab>
            <Tab eventKey="photos" title="Photos">
            <SRLWrapper>
            <div className="row px-3">

            {posts &&
                posts.filter(post => post.imageName !== 'none').map((post) => (
            <div className="col-lg-3 col-md-4 col-xs-6 m-0 p-0 thumb">
                <a href={post.imageData} className="thumbnail">
                    <img onError={(e) => e.target.src = process.env.PUBLIC_URL + "/img/no-image-available_1.jpg"} className="img-thumbnail"
                         src={post.imageData}
                         alt="" />
                </a> </div> 
                ))}             

              {posts && (posts.length === 0 || !posts.filter(post => post.imageName !== 'none').length) && <h6 className="m-2">No Photos found</h6>}
              </div>
              </SRLWrapper>
            </Tab>
          </Tabs>
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
