import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Home.css";
import SideBar from "../SideBar";
import { getUser } from "../../utils/utils";
import setAuthToken from "../../utils/setAuthToken";
import { useLocation } from "react-router";
import BasicInfo from "../BasicInfo";

export default function Covid19() {
  let [currentUser, setCurrentUser] = useState(getUser());
  const { key } = useLocation();
 
  useEffect(() => {
    if (currentUser.token) {
      setAuthToken(currentUser.token);
    }
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
          <h4>Covid19</h4>
          </div>
        <div className="col-md-3">
          <SideBar />
        </div>
      </div>
    </div>
  );
}
