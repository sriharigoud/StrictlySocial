import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { doLogout, isLogin } from "../utils/utils";
import { Link, useHistory } from "react-router-dom";

export default function Navigation() {
  let history = useHistory();
  const logout = () => {
    doLogout();
    history.push("/");
  };
  return (
    <div className="mb-0 w-100">
      <nav className="navbar navbar-light">
        <Link to="/home" title="Home" className="navbar-brand">
          DevConnector
        </Link>
        {isLogin() && <React.Fragment><form className="form-inline">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search user or post"
              className="form-control"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <div className="input-group-append">
              <button
                className="btn btn-outline-primary"
                type="button"
                id="button-addon2"
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
        </form>
        <a href="#" onClick={() => logout()}>Logout</a> </React.Fragment> }
      </nav>
    </div>
  );
}
