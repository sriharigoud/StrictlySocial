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

function Home({setAllPosts}) {
  let [currentUser, setCurrentUser] = useState(getUser());

  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    async function fetchPosts() {
      let response = await axios("/api/posts");
      setAllPosts(response.data);
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
            hideProfileInfoSmallDevices = {true} 
            setUserInfo={() => console.log("Do nothing")}
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
          />
         </div>
        <div className="col-md-6 border-left border-right">
          <CreatePost />
          <PostList />
        </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}

const mapDispatchToProps = dispatch => {
  return {
    setAllPosts: (payload) => dispatch(setAllPosts(payload)),
  }
}

export default connect(null, mapDispatchToProps)(Home);