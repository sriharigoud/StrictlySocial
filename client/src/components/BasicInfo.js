import React, { useEffect, useState } from "react";
import { doLogin } from "../utils/utils";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
export default function BasicInfo({
  userInfo,
  setUserInfo,
  setCurrentUser,
  currentUser,
}) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState(userInfo.bio);
  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const toggleFollow = async (userInfo) => {
    try {
      const res = await axios.put(`/api/users/follow/${userInfo._id}`);
      setUserInfo({ ...userInfo, followers: res.data.followers });
      setCurrentUser({
        ...currentUser,
        following: res.data.following.map((u) => u._id),
      });
      doLogin({
        ...currentUser,
        following: res.data.following.map((u) => u._id),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await axios.post(`/api/users/`, JSON.stringify({text: value}), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUserInfo({ ...userInfo, bio: res.data.bio });
      setCurrentUser({
        ...currentUser,
        bio: res.data.bio
      });
      doLogin({
        ...currentUser,
        bio: res.data.bio
      });
      handleClose()
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleEdit = () => {
    handleShow();
  };

  useEffect(() => {
    setValue(userInfo.bio)
  },[userInfo])

  return (
    <div className="card">
      <img src={userInfo.avatar} alt={userInfo.name} />
      {currentUser && currentUser._id === userInfo._id && (
        <button
          className="btn btn-primary w-50 m-auto"
          onClick={() => handleEdit()}
        >
          Edit Profile
        </button>
      )}
      {currentUser && currentUser._id !== userInfo._id && (
        <button
          onClick={() => toggleFollow(userInfo)}
          className="btn btn-primary w-50 m-auto"
        >
          {userInfo.followers &&
          userInfo.followers.some(
            (className) => className._id === currentUser._id
          )
            ? " Unfollow"
            : " Follow"}
        </button>
      )}
      <div className="card-body">
        <div className="h5 heading">{userInfo.name}</div>
        <div className="h7 text-muted">Email : {userInfo.email}</div>
        <div className="h7">{userInfo.bio}</div>
      </div>
      <ul className="list-group d-none d-md-block list-group-flush">
        <li className="list-group-item">
          <div className="h6 text-muted">Followers</div>
          <div className="h5">
            {userInfo.followers ? userInfo.followers.length : 0}
          </div>
        </li>
        <li className="list-group-item">
          <div className="h6 text-muted">Following</div>
          <div className="h5">
            {userInfo.following ? userInfo.following.length : 0}
          </div>
        </li>
        {/* <li className="list-group-item">Vestibulum at eros</li> */}
      </ul>
      <Modal show={show} onHide={handleClose}>
        <Modal.Body>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              value={value}
              onChange={handleChange}
              as="textarea"
              rows={3}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={saveProfile}>
            Save & Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
