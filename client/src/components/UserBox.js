import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Image, Transformation } from "cloudinary-react";
import { doLogin } from "../utils/utils";

export default function UserBox({
  user,
  currentUser,
  setUserInfo,
  userInfo,
  setCurrentUser,
}) {
  const toggleFollow = async (user) => {
    try {
      const res = await axios.put(`/api/users/follow/${user._id}`);
      setCurrentUser({
        ...currentUser,
        following: res.data.following.map((u) => u._id),
      });
      doLogin({
        ...currentUser,
        following: res.data.following.map((u) => u._id),
      });
      if (userInfo._id === currentUser._id) {
        setUserInfo({ ...userInfo, following: res.data.following });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="d-flex border my-2 pt-1 flex-row comment-row">
      <div className="p-1">
        <span className="round">
        {user.imageName === "none" && <img
            className="rounded-circle"
            onError={(e) => (e.target.src = user.avatar)}
            src={user.avatar}
            alt="user"
            width="50"
            height="50"
          />}
          {user.imageName !== "none" && (
            <Image
              alt={user.name}
              className="rounded-circle mr-2"
              placeholderColor="red"
              cloudName={"strictlysocial"}
              publicId={user.imageName}
            >
              <Transformation
                width="50"
                height="50"
                gravity="faces"
                crop="fill"
              />
            </Image>
          )}
        </span>
      </div>
      <div className="comment-text w-100 p-1">
        <span className="float-right action-icons my-2 mr-2">
          {user._id !== currentUser._id &&
            user._id !== "608438c33383641df099002a" && (
              <button
                data={JSON.stringify(currentUser.following)}
                onClick={() => toggleFollow(user)}
                className="btn btn-primary"
                title="Follow"
              >
                {currentUser.following &&
                currentUser.following.some((c) => c === user._id)
                  ? " Unfollow"
                  : " Follow"}
              </button>
            )}
        </span>
        <h5 className="mb-0">
          <Link to={`/profile/${user._id}`}>{user.name}</Link>
        </h5>
        <p className="my-0">{"@" + user.email.split("@")[0]}</p>
      </div>
    </div>
  );
}
