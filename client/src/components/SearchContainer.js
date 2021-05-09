import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import { useLocation } from "react-router";
import { Tabs, Tab, CardDeck, Card } from "react-bootstrap";
import UserBox from "./UserBox";
import BasicInfo from "./BasicInfo";
import PostList from "./PostList";
import { setAllPosts } from "../redux/Posts/Posts.actions";
import { connect } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Imgur from "./Imgur";

function SearchContainer({ searchKey, showPeople, setAllPosts, posts }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  let [sKey, setsKey] = useState("");
  const [users, setUsers] = useState([]);
  const { key } = useLocation();
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
    console.log(sKey, searchKey);
    if (sKey && sKey !== searchKey) {
      posts = [];
      page = 1;
      setPage(page + 1);
    }
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    let response = await axios(`/api/posts/search/${searchKey}/${page}/10`);
    setAllPosts(posts.concat(response.data));
    if (!response.data.length) {
      setHasMore(false);
    }
  }
  useEffect(() => {
    setsKey(searchKey);
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    async function searchUsers() {
      try {
        const res = await axios.get("/api/users/search/" + searchKey);
        setUsers(res.data);
      } catch (error) {
        console.log(error.message);
      }
    }
    setAllPosts([]);
    setPage(page + 1);
    searchUsers();
    fetchPosts();
  }, [key, getUser]);
  return (
    <div className="container-fluid mt-0 pt-2 gedf-wrapper border border-top-0 h-100">
      <div className="row">
        <div className="col-md-3 d-none d-md-block">
          <BasicInfo
            setUserInfo={() => console.log("Do nothing")}
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
        </div>
        <div className="col-md-6 border-left border-right ">
          <h5 className="mb-2 mt-2">Search results for "{searchKey}"</h5>
          <Tabs
            defaultActiveKey="posts"
            transition={false}
            id="noanim-tab-example"
          >
            <Tab eventKey="posts" title="Posts" className="pt-1">
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
            </Tab>

            {showPeople && (
              <Tab eventKey="people" title="People" className="pt-1">
                {users &&
                  users.map((user, d) => (
                    <UserBox
                      key={d}
                      setCurrentUser={setCurrentUser}
                      currentUser={currentUser}
                      user={user}
                    />
                  ))}
                {!users.length && <h6>No People Found</h6>}
              </Tab>
            )}

            {/* {searchKey === "entertainment" && (
              <Tab eventKey="imgur" title="Funny Images" className="pt-2">
                <Imgur />
              </Tab>
            )} */}
          </Tabs>
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
export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
