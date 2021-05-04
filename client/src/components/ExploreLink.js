import React, { useEffect } from "react";
import { Link } from "react-router-dom";

export default function ExploreLink({LinkData}) {
  useEffect(() => {});
  return (
    <li className="list-group-item my-0 py-2 px-1">
      <Link to={`/search/${LinkData.url}`}>
        <i className={`fa fa-fw ${LinkData.icon}`}></i> {LinkData.name}
      </Link>
    </li>
  );
}
