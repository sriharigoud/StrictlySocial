import React, { useEffect, useState } from "react";
import { doLogout } from "../utils/utils";
import { Image, Transformation } from "cloudinary-react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getUser } from "../utils/utils";
import { NavDropdown } from "react-bootstrap";
import ProfileLink from "./ProfileLink";
import DynamicImg from "./DynamicImg";

export default function Navigation({ notifications }) {
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setsearchQuery] = useState("");
  let history = useHistory();
  const { key } = useLocation();
  useEffect(() => {
    setUserInfo(getUser());
  }, [key]);
  const logout = () => {
    doLogout();
    setUserInfo({});
    history.push("/login");
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (searchQuery) {
      history.push("/search/" + searchQuery);
    }
  };
  return (
    <div className="mb-0 w-100">
      <nav className="navbar navbar-light">
        <Link to="/home" title="Home" className="navbar-brand">
          StrictlySocial
        </Link>
        {userInfo && userInfo.name && (
          <React.Fragment>
            <form onSubmit={(e) => handleFormSubmit(e)} className="form-inline">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search StrictlySocial"
                  className="form-control"
                  aria-label="Recipient's username"
                  onChange={(e) => setsearchQuery(e.target.value)}
                  aria-describedby="button-addon2"
                />
                <div className="input-group-append">
                  <button
                    onClick={() =>
                      searchQuery && history.push("/search/" + searchQuery)
                    }
                    className="btn btn-outline-primary"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-2">
              <span className="round float-left pt-0 mr-0 mt-1 ">
                <DynamicImg
                  avatar={userInfo.avatar}
                  imageName={userInfo.imageName}
                  width="30"
                  height="30"
                  CSSClassName="rounded-circle mr-"
                />
              </span>
              <NavDropdown
                title={userInfo.name}
                className="float-right"
                id="basic-nav-dropdown"
                collapseOnSelect="true"
              >
                <Link to={`/home`}>Home</Link> <NavDropdown.Divider />
                <Link to={`/notifications`}>
                  Notifications ({notifications.length})
                </Link>{" "}
                <NavDropdown.Divider />
                <ProfileLink
                  id={userInfo.email.split("@")[0]}
                  name="My Profile"
                />
                {""}
                <NavDropdown.Divider />
                <a role="button" onClick={() => logout()}>
                  Logout
                </a>
              </NavDropdown>
            </div>
          </React.Fragment>
        )}
      </nav>
    </div>
  );
}
