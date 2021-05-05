import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import BasicInfo from "./BasicInfo";
import CreatePost from "./CreatePost";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import PostList from "./PostList";
import { connect } from "react-redux";
import { setAllPosts } from "../redux/Posts/Posts.actions";
import InfiniteScroll from "react-infinite-scroll-component";

function Home({ setAllPosts, posts }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  let [page, setPage] = useState(1);
  let [hasMore, setHasMore] = useState(true);
  const fetchMoreData = () => {
    setPage(page + 1);
    fetchPosts();
  };
  async function fetchPosts() {
    if (page === 1) {
      posts = [];
    }
    let response = await axios(`/api/posts/${page}/10`);
    setAllPosts(posts.concat(response.data));
    if (!response.data.length) {
      setHasMore(false);
    }
  }
  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }

    try {
      setAllPosts([]);
      setPage(page + 1);
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
            hideProfileInfoSmallDevices={true}
            setUserInfo={() => console.log("Do nothing")}
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        </div>
        <div className="col-md-6 border-left border-right">
          <CreatePost />
          <hr />
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
            <PostList />
          </InfiniteScroll>
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    setAllPosts: (payload) => dispatch(setAllPosts(payload)),
  };
};

const mapStateToProps = (state) => {
  return {
    posts: state.posts.posts,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
