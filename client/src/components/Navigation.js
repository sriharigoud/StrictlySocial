import React, { useEffect, useState } from "react";

import { doLogout } from "../utils/utils";
import { Link, useHistory, useLocation } from "react-router-dom";
import { getUser } from "../utils/utils";
import { NavDropdown } from "react-bootstrap";
import ProfileLink from "./ProfileLink";
import DynamicImg from "./DynamicImg";
import axios from "axios";
import { Typeahead, withAsync } from "react-bootstrap-typeahead";
const AsyncTypeahead = withAsync(Typeahead);

export default function Navigation({ notifications }) {
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setsearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const filterBy = () => true;
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
  const handleSearch = async (query) => {
    try {
      setsearchQuery(query)
      let response = await axios.get(`/api/users/search/${query}`);
      setOptions(response.data);
    } catch (error) {
      console.log(error.message);
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
            <form onSubmit={(e) => handleFormSubmit(e)} className="form-inline AsyncTypeahead">
              <div className="input-group">
                {/* <input
                  type="text"
                  placeholder="Search StrictlySocial"
                  className="form-control"
                  aria-label="Recipient's username"
                  onChange={(e) => setsearchQuery(e.target.value)}
                  aria-describedby="button-addon2"
                /> */}
                <AsyncTypeahead
                  filterBy={filterBy}
                  id="async-example"
                  // className="form-control"
                  isLoading={isLoading}
                  searchText="Searching..."
                  labelKey="name"
                  minLength={3}
                  onSearch={handleSearch}
                  options={options}
                  value={searchQuery}
                  onKeyDown={(e) => e.target.value !== '' && e.keyCode === 13 && handleFormSubmit(e)}
                  onChange={(selected) => selected[0] && history.push("/profile/" + selected[0]._id)}
                  // onInputChange={(text) => setsearchQuery(text)}
                  placeholder="Search StrictlySocial"
                  renderMenuItemChildren={(option, props) => (
                    <React.Fragment>
                      <DynamicImg
                        CSSClassName="rounded-circle mr-2"
                        imageName={option.imageName}
                        width="30"
                        height="30"
                        avatar={option.avatar}
                      />
                      {option.name}
                    </React.Fragment>
                  )}
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
