import React, { useEffect, useState } from "react";
import { doLogout } from "../utils/utils";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getUser } from "../utils/utils";
import { NavDropdown } from "react-bootstrap";

export default function Navigation({notifications}) {
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setsearchQuery] = useState('');
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
  return (
    <div className="mb-0 w-100">
      <nav className="navbar navbar-light">
        <Link to="/home" title="Home" className="navbar-brand">
          StrictlySocial
        </Link>
        {userInfo && userInfo.name && (
          <React.Fragment>
            <form className="form-inline">
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
                    onClick={() => searchQuery && history.push("/search/"+searchQuery)}
                    className="btn btn-outline-primary"
                    type="button"
                    id="button-addon2"
                  >
                    <i className="fa fa-search"></i>
                  </button>
                </div>
              </div>
            </form>
            <div>
              <NavDropdown title={userInfo.name} id="collasible-nav-dropdown">
                <Link to={`/home`}>Home</Link> <NavDropdown.Divider />
                <Link to={`/notifications`}>Notifications ({notifications.length})</Link> <NavDropdown.Divider />
                <Link to={`/profile/${userInfo.email.split("@")[0]}`}>My Profile</Link>
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
