import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import InfiniteScroll from "react-infinite-scroll-component";
import BasicInfo from "./BasicInfo";
import SideBar from "./SideBar";
import { useLocation } from "react-router-dom";
import setAuthToken from "../utils/setAuthToken";
import CreatePost from "./CreatePost";
import { getUser } from "../utils/utils";
import { Image, Transformation } from "cloudinary-react";
import { Tabs, Tab } from "react-bootstrap";
import UserBox from "./UserBox";
import { SRLWrapper } from "simple-react-lightbox";
import { setAllPosts } from "../redux/Posts/Posts.actions";
import { connect } from "react-redux";
import PostList from "./PostList";

function Profile({ posts, setAllPosts }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [userInfo, setUserInfo] = useState({});
  const [activeEventKey, setActiveEventKey] = useState("feed");
  const { pathname, key } = useLocation();
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    setPage(page + 1);
    fetchPosts(userInfo._id);
  };
  async function fetchPosts(userid) {
    if (page === 1) {
      posts = [];
    }
    if (userInfo && userInfo._id !== userid) {
      setActiveEventKey("feed");
      posts = [];
      page = 1;
      setPage(page + 1);
    }
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    let response = await axios(`/api/posts/user/${userid}/${page}/10`);
    setAllPosts(posts.concat(response.data));
    if (!response.data.length) {
      setHasMore(false);
    }
  }
  useEffect(() => {
    async function getUserInfo() {
      if (currentUser.token) {
        setAuthToken(currentUser.token);
      }
      let response = await axios(
        "/api/users/" + pathname.replace("/profile/", "")
      );
      setUserInfo(response.data);
      setAllPosts([]);
      setPage(page + 1);
      fetchPosts(response.data._id);
    }
    try {
      getUserInfo();
    } catch (error) {
      console.log(error.message);
    }
  }, [key, getUser, setPage]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3">
          <BasicInfo
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
            hideExplore={true}
          />
        </div>
        <div className="col-md-6 border-left border-right ">
          {currentUser.email.split("@")[0] ===
            pathname.replace("/profile/", "") && <CreatePost />}
          <hr />
          <Tabs
            fill
            activeKey={activeEventKey}
            transition={false}
            onSelect={(k) => setActiveEventKey(k)}
            id="noanim-tab-example"
          >
            <Tab
              eventKey="feed"
              title={
                <span>
                  <i className="fa fa-rss" /> Feed
                </span>
              }
              className="pt-1"
            >
              <InfiniteScroll
                endMessage={
                  <p style={{ textAlign: "center" }}>
                    <b>Yay! You have seen it all</b>
                  </p>
                }
                dataLength={posts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  <h4 style={{ textAlign: "center" }}>
                    <i
                      className="fa fa-circle-o-notch fa-spin"
                      style={{ fontSize: "24px" }}
                    ></i>
                    Loading...
                  </h4>
                }
              >
                {" "}
                <PostList />
              </InfiniteScroll>
            </Tab>
            <Tab
              eventKey="following"
              title={
                <span>
                  <i className="fa fa-user" /> Following (
                  {userInfo.following && userInfo.following.length
                    ? userInfo.following.length
                    : 0}
                  )
                </span>
              }
            >
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
            <Tab
              eventKey="followers"
              title={
                <span>
                  <i className="fa fa-user" /> Followers (
                  {userInfo.followers && userInfo.followers.length
                    ? userInfo.followers.length
                    : 0}
                  )
                </span>
              }
            >
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
            <Tab
              eventKey="photos"
              title={
                <span>
                  <i className="fa fa-picture-o" /> Photos
                </span>
              }
            >
              <SRLWrapper>
                <div className="row px-3">
                  {posts &&
                    posts
                      .filter((post) => post.imageName !== "none")
                      .map((post) => (
                        <div
                          key={post._id}
                          className="col-lg-3 col-md-4 col-xs-6 m-0 p-0 thumb"
                        >
                          <a href={post.imageData} className="thumbnail">
                            <Image
                              className="img-thumbnail"
                              responsive
                              cloudName={"strictlysocial"}
                              publicId={post.imageName}
                            >
                              <Transformation
                                width="150"
                                height="150"
                                gravity="faces"
                                crop="fill"
                              />
                            </Image>
                          </a>{" "}
                        </div>
                      ))}

                  {posts &&
                    (posts.length === 0 ||
                      !posts.filter((post) => post.imageName !== "none")
                        .length) && <h6 className="m-2">No Photos found</h6>}
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

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setAllPosts: (payload) => dispatch(setAllPosts(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
