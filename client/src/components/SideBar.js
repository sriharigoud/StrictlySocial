import React from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

export default function SideBar() {
  return (
    <React.Fragment>
      <div className="card gedf-card">
        <div className="card-body">
          <h5 className="card-title">People you may follow</h5>
          <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="#" className="card-link">
            Card link
          </a>
          <a href="#" className="card-link">
            Another link
          </a>
        </div>
      </div>
      <div className="card gedf-card">
        <div className="card-body">
          <h5 className="card-title">Posts you may like</h5>
          <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </p>
          <a href="#" className="card-link">
            Card link
          </a>
          <a href="#" className="card-link">
            Another link
          </a>
        </div>
      </div>
    </React.Fragment>
  );
}
