import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Explore() {

  useEffect(() => {});
  return (
    <div className="card mt-2 mb-2 gedf-card">
    <div className="card-body px-2">
      <h5 className="card-title mb-2">Explore</h5>
      <div className="card-text border-top border-bottom">
        <ul className="list-group custom-nav border-0 mt-0 px-0 pt-0 list-group-flush">
          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/news">
              <i className="fa fa-fw fa-newspaper-o"></i> News
            </Link>
          </li>
          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/covid-19">
              <i className="fa fa-fw fa-medkit"></i> Covid-19
            </Link>
          </li>
          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/entertainment">
              <i className="fa fa-fw fa-film"></i> Entertainment
            </Link>
          </li>
          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/sports">
              <i className="fa fa-fw fa-trophy"></i> Sports
            </Link>
          </li>

          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/science">
            <i class="fa fa-flask"></i> Science
            </Link>
          </li>

          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/technology">
            <i class="fa fa-cogs"></i> Technology
            </Link>
          </li>

          <li className="list-group-item my-0 py-2 px-1">
            <Link to="/search/business">
                <i class="fa fa-briefcase"></i> Business
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </div>

  );
}
