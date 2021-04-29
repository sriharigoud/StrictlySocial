import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import SideBar from "./SideBar";
import { getUser } from "../utils/utils";
import setAuthToken from "../utils/setAuthToken";
import { useLocation } from "react-router";
import { Tabs, Tab } from "react-bootstrap";
import UserBox from "./UserBox";
import BasicInfo from "./BasicInfo";
import PostList from "./PostList";
import { setAllPosts } from "../redux/Posts/Posts.actions";
import { connect } from "react-redux";

function SearchContainer({ searchKey, showPeople, setAllPosts }) {
  let [currentUser, setCurrentUser] = useState(getUser());
  const [users, setUsers] = useState([]);
  const { key } = useLocation();

  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
    async function getPopular() {
      try {
        const res = await axios.get("/api/posts/search/" + searchKey);
        setAllPosts(res.data);
      } catch (error) {
        console.log(error.message);
      }
      try {
        const res = await axios.get("/api/users/search/" + searchKey);
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
            setUserInfo={() => console.log("Do nothing")}
            userInfo={currentUser}
            setCurrentUser={setCurrentUser}
            currentUser={currentUser}
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
              <PostList />
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

export default connect(null, mapDispatchToProps)(SearchContainer);
