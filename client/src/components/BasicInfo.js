import React from "react";

export default function BasicInfo({userInfo}) {
  return (
    <div className="card">
      <img
        src={userInfo.avatar}
        alt={userInfo.name}
      />
      <div className="card-body">
        <div className="h5 heading">{userInfo.name}</div>
        <div className="h7 text-muted">Email : {userInfo.email}</div>
        <div className="h7">
          Developer of web applications, JavaScript, PHP, Java, Python, Ruby,
          Java, Node.js, etc.
        </div>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <div className="h6 text-muted">Followers</div>
          <div className="h5">5.2342</div>
        </li>
        <li className="list-group-item">
          <div className="h6 text-muted">Following</div>
          <div className="h5">6758</div>
        </li>
        <li className="list-group-item">Vestibulum at eros</li>
      </ul>
    </div>
  );
}
