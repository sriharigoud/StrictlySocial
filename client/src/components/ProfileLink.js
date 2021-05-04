import React from "react";
import { Link } from "react-router-dom";

export default function ProfileLink({ rest, id, name }) {
  return (
    <Link {...rest} to={`/profile/${id}`}>
      {name}
    </Link>
  );
}
